import type { SourceType } from "../../generated/prisma";
import type { IngestResult, NormalizedSource } from "@/lib/ingest/types";
import { saveSources } from "@/lib/ingest/save";

type AdapterInput = {
  query: string;
  limit?: number;
  days?: number;
  fromYear?: number;
};

async function finish(
  adapter: SourceType,
  query: string,
  records: NormalizedSource[],
  missingKeys: string[] = []
): Promise<IngestResult> {
  return {
    adapter,
    query,
    recordsFound: records.length,
    recordsSaved: records.length ? await saveSources(records) : 0,
    missingKeys
  };
}

export async function ingestOpenAlex({ query, limit = 25, fromYear = 2015 }: AdapterInput): Promise<IngestResult> {
  try {
    const url = new URL("https://api.openalex.org/works");
    url.searchParams.set("search", query);
    url.searchParams.set("filter", `from_publication_date:${fromYear}-01-01`);
    url.searchParams.set("per-page", String(Math.min(limit, 50)));

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return {
        adapter: "OPENALEX",
        query,
        recordsFound: 0,
        recordsSaved: 0,
        error: `OpenAlex API responded with status ${response.status}`
      };
    }
    const payload = await response.json();

    const records: NormalizedSource[] = (payload.results ?? []).map((work: any) => ({
      sourceType: "OPENALEX",
      title: work.display_name ?? "Untitled OpenAlex work",
      url: work.doi ?? work.id,
      excerpt: work.abstract_inverted_index ? "OpenAlex abstract metadata available." : "",
      publishedAt: work.publication_year ? new Date(`${work.publication_year}-01-01`) : null,
      platform: "openalex",
      rawMeta: { openalexId: work.id, query }
    }));

    return finish("OPENALEX", query, records);
  } catch (error) {
    return {
      adapter: "OPENALEX",
      query,
      recordsFound: 0,
      recordsSaved: 0,
      error: error instanceof Error ? error.message : "OpenAlex request failed"
    };
  }
}

export async function ingestGithub({ query, limit = 25 }: AdapterInput): Promise<IngestResult> {
  try {
    const url = new URL("https://api.github.com/search/repositories");
    url.searchParams.set("q", query);
    url.searchParams.set("per_page", String(Math.min(limit, 100)));

    const headers: HeadersInit = { Accept: "application/vnd.github+json" };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, { headers, cache: "no-store" });
    if (!response.ok) {
      return {
        adapter: "GITHUB",
        query,
        recordsFound: 0,
        recordsSaved: 0,
        error: `GitHub API responded with status ${response.status}`
      };
    }
    const payload = await response.json();

    const records: NormalizedSource[] = (payload.items ?? []).map((repo: any) => ({
      sourceType: "GITHUB",
      title: repo.full_name,
      url: repo.html_url,
      excerpt: repo.description ?? "",
      author: repo.owner?.login ?? null,
      platform: "github",
      rawMeta: { stars: repo.stargazers_count, language: repo.language, query }
    }));

    return finish("GITHUB", query, records, token ? [] : ["GITHUB_TOKEN optional"]);
  } catch (error) {
    return {
      adapter: "GITHUB",
      query,
      recordsFound: 0,
      recordsSaved: 0,
      error: error instanceof Error ? error.message : "GitHub request failed"
    };
  }
}

export async function ingestGdelt({ query, limit = 25, days = 30 }: AdapterInput): Promise<IngestResult> {
  try {
    const url = new URL("https://api.gdeltproject.org/api/v2/doc/doc");
    url.searchParams.set("query", query);
    url.searchParams.set("mode", "artlist");
    url.searchParams.set("format", "json");
    url.searchParams.set("maxrecords", String(Math.min(limit, 250)));
    url.searchParams.set("timespan", `${days}d`);

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return {
        adapter: "GDELT",
        query,
        recordsFound: 0,
        recordsSaved: 0,
        error: `GDELT API responded with status ${response.status}`
      };
    }
    const payload = await response.json();

    const records: NormalizedSource[] = (payload.articles ?? []).map((article: any) => ({
      sourceType: "GDELT",
      title: article.title ?? "Untitled GDELT article",
      url: article.url,
      excerpt: article.snippet ?? "",
      publishedAt: article.seendate ? new Date(article.seendate) : null,
      platform: article.domain ?? "gdelt",
      rawMeta: { query, source: article }
    }));

    return finish("GDELT", query, records);
  } catch (error) {
    return {
      adapter: "GDELT",
      query,
      recordsFound: 0,
      recordsSaved: 0,
      error: error instanceof Error ? error.message : "GDELT request failed"
    };
  }
}

export async function ingestYoutube({ query, limit = 25 }: AdapterInput): Promise<IngestResult> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key || key.trim() === "") {
    return finish("YOUTUBE", query, [], ["YOUTUBE_API_KEY"]);
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", String(Math.min(limit, 50)));
    url.searchParams.set("key", key);

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return {
        adapter: "YOUTUBE",
        query,
        recordsFound: 0,
        recordsSaved: 0,
        error: `YouTube API responded with status ${response.status}: ${errText.slice(0, 100)}`
      };
    }
    const payload = await response.json();

    const records: NormalizedSource[] = (payload.items ?? []).map((item: any) => ({
      sourceType: "YOUTUBE",
      title: item.snippet?.title ?? "Untitled YouTube video",
      url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
      excerpt: item.snippet?.description ?? "",
      publishedAt: item.snippet?.publishedAt ? new Date(item.snippet.publishedAt) : null,
      author: item.snippet?.channelTitle ?? null,
      platform: "youtube",
      rawMeta: { query, videoId: item.id?.videoId }
    }));

    return finish("YOUTUBE", query, records);
  } catch (error) {
    return {
      adapter: "YOUTUBE",
      query,
      recordsFound: 0,
      recordsSaved: 0,
      error: error instanceof Error ? error.message : "YouTube request failed"
    };
  }
}

export async function runAdapter(adapter: SourceType, input: AdapterInput): Promise<IngestResult> {
  switch (adapter) {
    case "OPENALEX":
      return ingestOpenAlex(input);
    case "GITHUB":
      return ingestGithub(input);
    case "GDELT":
      return ingestGdelt(input);
    case "YOUTUBE":
      return ingestYoutube(input);
    default:
      return {
        adapter,
        query: input.query,
        recordsFound: 0,
        recordsSaved: 0,
        error: `Adapter ${adapter} is not implemented for API pulling yet.`
      };
  }
}
