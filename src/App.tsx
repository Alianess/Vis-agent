import { useEffect, useState } from "react";
import {
  apiCards,
  examplePanels,
  functionCallDemos,
  introTopics,
  ioDemo,
  learningModules,
  mcpClarifyNote,
  mcpComparisons,
  mcpCoreParts,
  mcpDemoScenario,
  mcpDifferenceRows,
  mcpExamples,
  mcpFlowSteps,
  mcpMisconceptions,
  mcpPlainFacts,
  mcpRealityNotes,
  searchApiNotes,
  searchSourceDemos,
  reactDemo,
  reactExplainCards,
  reactImplementationNotes,
  stagePills,
  structuredOutputDemo,
  systemPromptDemos,
} from "./content";

type Route = "home" | "learn";

type DuckDuckGoTopic = {
  FirstURL?: string;
  Result?: string;
  Text?: string;
  Name?: string;
  Topics?: DuckDuckGoTopic[];
};

type DuckDuckGoResponse = {
  AbstractText?: string;
  AbstractURL?: string;
  Answer?: string;
  AnswerType?: string;
  Definition?: string;
  DefinitionURL?: string;
  Heading?: string;
  RelatedTopics?: DuckDuckGoTopic[];
  Results?: DuckDuckGoTopic[];
};

type SearchItem = {
  title: string;
  text: string;
  url?: string;
  source: string;
  score?: number;
};

type SearchSourceId = "wikipedia" | "github" | "arxiv" | "openlibrary";

type SearchPayload = {
  featured?: SearchItem;
  items: SearchItem[];
  requestPreview: string;
};

type WikipediaSearchResponse = {
  query?: {
    search?: Array<{
      title: string;
      snippet?: string;
    }>;
  };
};

type SemanticScholarPaper = {
  title?: string;
  abstract?: string;
  url?: string;
  year?: number;
  authors?: Array<{ name?: string }>;
  externalIds?: {
    ArXiv?: string;
  };
  openAccessPdf?: {
    url?: string;
  };
};

type SemanticScholarResponse = {
  data?: SemanticScholarPaper[];
};

type OpenLibraryResponse = {
  docs?: Array<{
    title?: string;
    author_name?: string[];
    first_publish_year?: number;
    key?: string;
  }>;
};

type WikipediaPageResponse = {
  query?: {
    pages?: Record<
      string,
      {
        title?: string;
        extract?: string;
        fullurl?: string;
      }
    >;
  };
};

function getRouteFromHash(hash: string): Route {
  return hash === "#/learn" ? "learn" : "home";
}

function flattenDuckDuckGoTopics(topics: DuckDuckGoTopic[] = []): SearchItem[] {
  return topics.flatMap((topic) => {
    if (topic.Topics?.length) {
      return flattenDuckDuckGoTopics(topic.Topics);
    }

    const title = topic.Text?.split(" - ")[0] || topic.Name || "相关主题";
    return topic.Text
      ? [
          {
            title,
            text: topic.Text,
            url: topic.FirstURL,
            source: "相关主题源",
          },
        ]
      : [];
  });
}

function searchDuckDuckGoInstantAnswer(query: string): Promise<DuckDuckGoResponse> {
  return new Promise((resolve, reject) => {
    const callbackName = `ddgCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const callbackStore = window as unknown as Record<string, unknown>;
    const cleanup = () => {
      delete callbackStore[callbackName];
      script.remove();
    };

    callbackStore[callbackName] = (data: DuckDuckGoResponse) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("DuckDuckGo 请求失败"));
    };

    const params = new URLSearchParams({
      q: query,
      format: "json",
      pretty: "1",
      no_redirect: "1",
      no_html: "1",
      skip_disambig: "0",
      callback: callbackName,
    });

    script.src = `https://api.duckduckgo.com/?${params.toString()}`;
    document.body.appendChild(script);
  });
}

async function fetchWikipediaSummary(
  query: string,
): Promise<{ title: string; summary: string; url: string; sourceLabel: string } | null> {
  const searchLanguages = [
    { code: "zh", label: "Wikipedia 中文词条兜底" },
    { code: "en", label: "Wikipedia 英文词条兜底" },
  ];

  for (const language of searchLanguages) {
    const searchParams = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: query,
      format: "json",
      origin: "*",
      utf8: "1",
      srlimit: "1",
    });

    const searchResponse = await fetch(
      `https://${language.code}.wikipedia.org/w/api.php?${searchParams.toString()}`,
    );
    if (!searchResponse.ok) {
      continue;
    }

    const searchData = (await searchResponse.json()) as WikipediaSearchResponse;
    const title = searchData.query?.search?.[0]?.title;
    if (!title) {
      continue;
    }

    const pageParams = new URLSearchParams({
      action: "query",
      prop: "extracts|info",
      exintro: "1",
      explaintext: "1",
      inprop: "url",
      titles: title,
      format: "json",
      origin: "*",
    });

    const pageResponse = await fetch(
      `https://${language.code}.wikipedia.org/w/api.php?${pageParams.toString()}`,
    );
    if (!pageResponse.ok) {
      continue;
    }

    const pageData = (await pageResponse.json()) as WikipediaPageResponse;
    const page = Object.values(pageData.query?.pages ?? {})[0];
    if (page?.extract) {
      return {
        title: page.title || title,
        summary: page.extract,
        url: page.fullurl || `https://${language.code}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
        sourceLabel: language.label,
      };
    }
  }

  return null;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

async function fetchWikipediaSearchItems(query: string, limit = 5): Promise<SearchItem[]> {
  const languages = ["zh", "en"];

  for (const language of languages) {
    const params = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: query,
      format: "json",
      origin: "*",
      utf8: "1",
      srlimit: String(limit),
    });

    const response = await fetch(`https://${language}.wikipedia.org/w/api.php?${params.toString()}`);
    if (!response.ok) {
      continue;
    }

    const data = (await response.json()) as WikipediaSearchResponse & {
      query?: { search?: Array<{ title: string; snippet?: string }> };
    };

    const items =
      data.query?.search?.map((item) => ({
        title: item.title,
        text: stripHtml(item.snippet || ""),
        url: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
        source: language === "zh" ? "Wikipedia 中文" : "Wikipedia English",
      })) ?? [];

    if (items.length > 0) {
      return items;
    }
  }

  return [];
}

async function searchWikipedia(query: string, limit: number): Promise<SearchPayload> {
  const [items, summary] = await Promise.all([
    fetchWikipediaSearchItems(query, limit),
    fetchWikipediaSummary(query),
  ]);

  const featured = summary
    ? {
        title: summary.title,
        text: summary.summary,
        url: summary.url,
        source: summary.sourceLabel,
      }
    : items[0];

  return {
    featured,
    items: items.filter((item) => item.url !== featured?.url).slice(0, limit - 1),
    requestPreview: `GET https://zh.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query,
    )}&format=json&origin=*`,
  };
}

async function searchGitHubRepositories(query: string, limit: number): Promise<SearchPayload> {
  const params = new URLSearchParams({
    q: query,
    per_page: String(limit),
    sort: "stars",
    order: "desc",
  });
  const response = await fetch(`https://api.github.com/search/repositories?${params.toString()}`);
  if (!response.ok) {
    throw new Error("GitHub 搜索失败");
  }

  const data = (await response.json()) as {
    items?: Array<{
      full_name: string;
      description?: string;
      html_url: string;
      language?: string;
      stargazers_count?: number;
    }>;
  };

  const items: SearchItem[] =
    data.items?.map((item) => ({
      title: item.full_name,
      text: `${item.description || "暂无描述"}${item.language ? ` · ${item.language}` : ""}${
        typeof item.stargazers_count === "number" ? ` · ${item.stargazers_count} stars` : ""
      }`,
      url: item.html_url,
      source: "GitHub 仓库",
    })) ?? [];

  return {
    featured: items[0],
    items: items.slice(1),
    requestPreview: `GET https://api.github.com/search/repositories?q=${encodeURIComponent(
      query,
    )}&per_page=${limit}&sort=stars&order=desc`,
  };
}

async function searchArxiv(query: string, limit: number): Promise<SearchPayload> {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    fields: "title,abstract,url,authors,year,externalIds,openAccessPdf",
  });
  const response = await fetch(
    `https://api.semanticscholar.org/graph/v1/paper/search?${params.toString()}`,
  );
  if (!response.ok) {
    throw new Error("arXiv 搜索失败");
  }

  const data = (await response.json()) as SemanticScholarResponse;
  const entries: SearchItem[] =
    data.data?.map((paper) => {
      const arxivId = paper.externalIds?.ArXiv;
      const authors = paper.authors?.map((author) => author.name).filter(Boolean).slice(0, 3).join(" / ");
      const year = paper.year ? ` · ${paper.year}` : "";
      const abstract = paper.abstract?.trim();

      return {
        title: paper.title || "未命名论文",
        text: abstract || `${authors || "未知作者"}${year}`,
        url:
          arxivId
            ? `https://arxiv.org/abs/${arxivId}`
            : paper.openAccessPdf?.url || paper.url || "",
        source: arxivId ? "arXiv 论文" : "学术论文",
      };
    }) ?? [];

  return {
    featured: entries[0],
    items: entries.slice(1),
    requestPreview: `GET https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
      query,
    )}&limit=${limit}&fields=title,abstract,url,authors,year,externalIds,openAccessPdf`,
  };
}

async function searchOpenLibrary(query: string, limit: number): Promise<SearchPayload> {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    fields: "key,title,author_name,first_publish_year",
  });
  const response = await fetch(`https://openlibrary.org/search.json?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Open Library 搜索失败：HTTP ${response.status}`);
  }

  const data = (await response.json()) as OpenLibraryResponse;

  const items: SearchItem[] =
    data.docs?.map((item) => ({
      title: item.title || "未命名图书",
      text: `${item.author_name?.join(" / ") || "未知作者"}${
        item.first_publish_year ? ` · ${item.first_publish_year}` : ""
      }`,
      url: item.key ? `https://openlibrary.org${item.key}` : undefined,
      source: "Open Library",
    })) ?? [];

  if (items.length === 0) {
    throw new Error("Open Library 搜索失败：接口返回为空");
  }

  return {
    featured: items[0],
    items: items.slice(1),
    requestPreview: `GET https://openlibrary.org/search.json?q=${encodeURIComponent(
      query,
    )}&limit=${limit}&fields=key,title,author_name,first_publish_year`,
  };
}

function buildLocalSearchItems(): SearchItem[] {
  return [
    ...introTopics.map((item) => ({
      title: item.title,
      text: item.body,
      source: "站内课程",
      url: "#/learn",
    })),
    ...searchApiNotes.map((item) => ({
      title: item.title,
      text: item.body,
      source: "搜索 API 说明",
      url: "#/learn",
    })),
    ...systemPromptDemos.map((item) => ({
      title: item.title,
      text: `${item.subtitle} ${item.note}`,
      source: "系统提示词示例",
      url: "#/learn",
    })),
  ];
}

function tokenizeQuery(query: string): string[] {
  const lowered = query.toLowerCase();
  const asciiTokens = lowered.match(/[a-z0-9]+/g) ?? [];
  const cjkTokens = Array.from(lowered.match(/[\u4e00-\u9fff]/g) ?? []);
  return Array.from(new Set([...asciiTokens.filter((item) => item.length > 1), ...cjkTokens]));
}

function scoreSearchItem(query: string, item: SearchItem): number {
  const queryText = query.trim().toLowerCase();
  const title = item.title.toLowerCase();
  const text = item.text.toLowerCase();
  const tokens = tokenizeQuery(queryText);

  let score = 0;

  if (queryText && title.includes(queryText)) {
    score += 20;
  }
  if (queryText && text.includes(queryText)) {
    score += 10;
  }

  for (const token of tokens) {
    if (title.includes(token)) {
      score += 6;
    }
    if (text.includes(token)) {
      score += 3;
    }
  }

  if (item.source === "网页答案源") {
    score += 18;
  } else if (item.source === "相关主题源") {
    score += 12;
  } else if (item.source === "Wikipedia 中文") {
    score += 5;
  } else if (item.source === "Wikipedia English") {
    score += 3;
  } else if (item.source === "站内课程" || item.source === "搜索 API 说明") {
    score -= 6;
  }

  return score;
}

function rankSearchItems(query: string, items: SearchItem[], topK: number): SearchItem[] {
  const deduped = items.reduce<SearchItem[]>((acc, item) => {
    const key = `${item.title}::${item.url ?? ""}`;
    if (!acc.some((existing) => `${existing.title}::${existing.url ?? ""}` === key)) {
      acc.push(item);
    }
    return acc;
  }, []);

  return deduped
    .map((item) => ({
      ...item,
      score: scoreSearchItem(query, item),
    }))
    .filter((item) => (item.score ?? 0) > 0)
    .sort((left, right) => (right.score ?? 0) - (left.score ?? 0))
    .slice(0, topK);
}

function App() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "未配置";
  const [route, setRoute] = useState<Route>(getRouteFromHash(window.location.hash));
  const [activeModule, setActiveModule] = useState("io");
  const [thinkEnabled, setThinkEnabled] = useState(true);
  const [runSeed, setRunSeed] = useState(0);
  const [typedInput, setTypedInput] = useState("");
  const [streamedThink, setStreamedThink] = useState("");
  const [streamedOutput, setStreamedOutput] = useState("");
  const [streamPhase, setStreamPhase] = useState<
    "typing" | "reading" | "thinking" | "answering" | "done"
  >("typing");
  const [isThinkCollapsed, setIsThinkCollapsed] = useState(false);
  const [activeSystemPreset, setActiveSystemPreset] = useState(systemPromptDemos[0].id);
  const [systemThinkEnabled, setSystemThinkEnabled] = useState(true);
  const [systemRunSeed, setSystemRunSeed] = useState(0);
  const [typedSystemPrompt, setTypedSystemPrompt] = useState("");
  const [typedSystemInput, setTypedSystemInput] = useState("");
  const [streamedSystemThink, setStreamedSystemThink] = useState("");
  const [streamedSystemOutput, setStreamedSystemOutput] = useState("");
  const [systemPhase, setSystemPhase] = useState<
    "prompting" | "typing" | "reading" | "thinking" | "answering" | "done"
  >("prompting");
  const [isSystemThinkCollapsed, setIsSystemThinkCollapsed] = useState(false);
  const [structuredThinkEnabled, setStructuredThinkEnabled] = useState(true);
  const [structuredRunSeed, setStructuredRunSeed] = useState(0);
  const [typedStructuredInput, setTypedStructuredInput] = useState("");
  const [streamedNaturalThink, setStreamedNaturalThink] = useState("");
  const [streamedNaturalOutput, setStreamedNaturalOutput] = useState("");
  const [streamedStructuredThink, setStreamedStructuredThink] = useState("");
  const [streamedStructuredOutput, setStreamedStructuredOutput] = useState("");
  const [structuredPhase, setStructuredPhase] = useState<
    "typing" | "reading" | "natural-thinking" | "natural-output" | "json-thinking" | "json-output" | "done"
  >("typing");
  const [isNaturalThinkCollapsed, setIsNaturalThinkCollapsed] = useState(false);
  const [isJsonThinkCollapsed, setIsJsonThinkCollapsed] = useState(false);
  const [activeFunctionPreset, setActiveFunctionPreset] = useState(functionCallDemos[0].id);
  const [functionThinkEnabled, setFunctionThinkEnabled] = useState(true);
  const [functionRunSeed, setFunctionRunSeed] = useState(0);
  const [typedFunctionInput, setTypedFunctionInput] = useState("");
  const [streamedFunctionThink, setStreamedFunctionThink] = useState("");
  const [streamedFunctionCall, setStreamedFunctionCall] = useState("");
  const [functionPhase, setFunctionPhase] = useState<"typing" | "thinking" | "calling" | "done">(
    "typing",
  );
  const [isFunctionThinkCollapsed, setIsFunctionThinkCollapsed] = useState(false);
  const [reactRunSeed, setReactRunSeed] = useState(0);
  const [typedReactInput, setTypedReactInput] = useState("");
  const [typedReactThought, setTypedReactThought] = useState("");
  const [typedReactToolCall, setTypedReactToolCall] = useState("");
  const [typedReactServer, setTypedReactServer] = useState("");
  const [typedReactObservation, setTypedReactObservation] = useState("");
  const [typedReactAnswer, setTypedReactAnswer] = useState("");
  const [activeReactRound, setActiveReactRound] = useState(0);
  const [reactPlaybackComplete, setReactPlaybackComplete] = useState(false);
  const [reactPhase, setReactPhase] = useState<
    "typing" | "thought" | "act" | "server" | "observe" | "loopback" | "answer" | "done"
  >("typing");
  const [activeSearchSource, setActiveSearchSource] = useState<SearchSourceId>(
    searchSourceDemos[0].id as SearchSourceId,
  );
  const [searchQuery, setSearchQuery] = useState(searchSourceDemos[0].defaultQuery);
  const [searchLimit, setSearchLimit] = useState(5);
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [searchError, setSearchError] = useState("");
  const [searchHeading, setSearchHeading] = useState("");
  const [searchSummary, setSearchSummary] = useState("");
  const [searchSource, setSearchSource] = useState("");
  const [searchSourceLabel, setSearchSourceLabel] = useState("聚合搜索结果");
  const [searchItems, setSearchItems] = useState<SearchItem[]>([]);
  const [searchRequestPreview, setSearchRequestPreview] = useState("");

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRouteFromHash(window.location.hash));
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const currentSystemPreset =
    systemPromptDemos.find((preset) => preset.id === activeSystemPreset) ?? systemPromptDemos[0];
  const currentFunctionPreset =
    functionCallDemos.find((preset) => preset.id === activeFunctionPreset) ?? functionCallDemos[0];
  const currentSearchSource =
    searchSourceDemos.find((preset) => preset.id === activeSearchSource) ?? searchSourceDemos[0];

  useEffect(() => {
    if (route !== "learn" || activeModule !== "io") {
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const typeText = async (
      text: string,
      setter: (value: string) => void,
      step = 1,
      delay = 24,
    ) => {
      let current = "";

      for (let index = 0; index < text.length; index += step) {
        if (cancelled) {
          return;
        }

        current = text.slice(0, index + step);
        setter(current);
        await sleep(delay);
      }
    };

    const runDemo = async () => {
      setTypedInput("");
      setStreamedThink("");
      setStreamedOutput("");
      setIsThinkCollapsed(false);
      setStreamPhase("typing");

      await typeText(ioDemo.input, setTypedInput, 1, 22);
      if (cancelled) {
        return;
      }

      setStreamPhase("reading");
      await sleep(380);
      if (cancelled) {
        return;
      }

      if (thinkEnabled) {
        setStreamPhase("thinking");
        await typeText(`<think>\n${ioDemo.think}\n</think>`, setStreamedThink, 2, 18);
        if (cancelled) {
          return;
        }

        await sleep(520);
        if (cancelled) {
          return;
        }

        setIsThinkCollapsed(true);
        await sleep(260);
        if (cancelled) {
          return;
        }
      }

      setStreamPhase("answering");
      await typeText(ioDemo.output, setStreamedOutput, 2, 20);
      if (cancelled) {
        return;
      }

      setStreamPhase("done");
    };

    void runDemo();

    return () => {
      cancelled = true;
    };
  }, [route, activeModule, thinkEnabled, runSeed]);

  useEffect(() => {
    if (route !== "learn" || activeModule !== "system") {
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const typeText = async (
      text: string,
      setter: (value: string) => void,
      step = 1,
      delay = 24,
    ) => {
      let current = "";

      for (let index = 0; index < text.length; index += step) {
        if (cancelled) {
          return;
        }

        current = text.slice(0, index + step);
        setter(current);
        await sleep(delay);
      }
    };

    const runDemo = async () => {
      setTypedSystemPrompt("");
      setTypedSystemInput("");
      setStreamedSystemThink("");
      setStreamedSystemOutput("");
      setIsSystemThinkCollapsed(false);
      setSystemPhase("prompting");

      await typeText(currentSystemPreset.systemPrompt, setTypedSystemPrompt, 3, 10);
      if (cancelled) {
        return;
      }

      await sleep(180);
      if (cancelled) {
        return;
      }

      setSystemPhase("typing");
      await typeText(currentSystemPreset.userInput, setTypedSystemInput, 1, 22);
      if (cancelled) {
        return;
      }

      setSystemPhase("reading");
      await sleep(380);
      if (cancelled) {
        return;
      }

      if (systemThinkEnabled) {
        setSystemPhase("thinking");
        await typeText(
          `<think>\n${currentSystemPreset.think}\n</think>`,
          setStreamedSystemThink,
          2,
          16,
        );
        if (cancelled) {
          return;
        }

        await sleep(520);
        if (cancelled) {
          return;
        }

        setIsSystemThinkCollapsed(true);
        await sleep(260);
        if (cancelled) {
          return;
        }
      }

      setSystemPhase("answering");
      await typeText(currentSystemPreset.output, setStreamedSystemOutput, 2, 18);
      if (cancelled) {
        return;
      }

      setSystemPhase("done");
    };

    void runDemo();

    return () => {
      cancelled = true;
    };
  }, [route, activeModule, activeSystemPreset, systemThinkEnabled, systemRunSeed, currentSystemPreset]);

  useEffect(() => {
    if (route !== "learn" || activeModule !== "structured") {
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const typeText = async (
      text: string,
      setter: (value: string) => void,
      step = 1,
      delay = 24,
    ) => {
      let current = "";

      for (let index = 0; index < text.length; index += step) {
        if (cancelled) {
          return;
        }

        current = text.slice(0, index + step);
        setter(current);
        await sleep(delay);
      }
    };

    const runDemo = async () => {
      setTypedStructuredInput("");
      setStreamedNaturalThink("");
      setStreamedNaturalOutput("");
      setStreamedStructuredThink("");
      setStreamedStructuredOutput("");
      setIsNaturalThinkCollapsed(false);
      setIsJsonThinkCollapsed(false);
      setStructuredPhase("typing");

      await typeText(structuredOutputDemo.userInput, setTypedStructuredInput, 1, 18);
      if (cancelled) {
        return;
      }

      setStructuredPhase("reading");
      await sleep(320);
      if (cancelled) {
        return;
      }

      if (structuredThinkEnabled) {
        setStructuredPhase("natural-thinking");
        await typeText(
          `<think>\n${structuredOutputDemo.naturalThink}\n</think>`,
          setStreamedNaturalThink,
          2,
          15,
        );
        if (cancelled) {
          return;
        }

        await sleep(360);
        if (cancelled) {
          return;
        }

        setIsNaturalThinkCollapsed(true);
      }

      setStructuredPhase("natural-output");
      await typeText(structuredOutputDemo.naturalOutput, setStreamedNaturalOutput, 2, 18);
      if (cancelled) {
        return;
      }

      await sleep(180);
      if (cancelled) {
        return;
      }

      if (structuredThinkEnabled) {
        setStructuredPhase("json-thinking");
        await typeText(
          `<think>\n${structuredOutputDemo.structuredThink}\n</think>`,
          setStreamedStructuredThink,
          2,
          14,
        );
        if (cancelled) {
          return;
        }

        await sleep(360);
        if (cancelled) {
          return;
        }

        setIsJsonThinkCollapsed(true);
      }

      setStructuredPhase("json-output");
      await typeText(structuredOutputDemo.structuredOutput, setStreamedStructuredOutput, 2, 16);
      if (cancelled) {
        return;
      }

      setStructuredPhase("done");
    };

    void runDemo();

    return () => {
      cancelled = true;
    };
  }, [route, activeModule, structuredThinkEnabled, structuredRunSeed]);

  useEffect(() => {
    if (route !== "learn" || activeModule !== "function") {
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const typeText = async (
      text: string,
      setter: (value: string) => void,
      step = 1,
      delay = 24,
    ) => {
      let current = "";

      for (let index = 0; index < text.length; index += step) {
        if (cancelled) {
          return;
        }

        current = text.slice(0, index + step);
        setter(current);
        await sleep(delay);
      }
    };

    const buildFunctionCallJson = () => `{
  "type": "function_call",
  "name": "${currentFunctionPreset.functionName}",
  "arguments": ${currentFunctionPreset.argumentsJson
    .split("\n")
    .map((line, index) => (index === 0 ? line : `  ${line}`))
    .join("\n")}
}`;

    const runDemo = async () => {
      setTypedFunctionInput("");
      setStreamedFunctionThink("");
      setStreamedFunctionCall("");
      setIsFunctionThinkCollapsed(false);
      setFunctionPhase("typing");

      await typeText(currentFunctionPreset.userInput, setTypedFunctionInput, 1, 20);
      if (cancelled) {
        return;
      }

      if (functionThinkEnabled) {
        setFunctionPhase("thinking");
        await typeText(
          `<think>\n${currentFunctionPreset.think}\n</think>`,
          setStreamedFunctionThink,
          2,
          16,
        );
        if (cancelled) {
          return;
        }

        await sleep(420);
        if (cancelled) {
          return;
        }

        setIsFunctionThinkCollapsed(true);
      }

      setFunctionPhase("calling");
      await typeText(buildFunctionCallJson(), setStreamedFunctionCall, 2, 14);
      if (cancelled) {
        return;
      }

      setFunctionPhase("done");
    };

    void runDemo();

    return () => {
      cancelled = true;
    };
  }, [
    route,
    activeModule,
    activeFunctionPreset,
    functionThinkEnabled,
    functionRunSeed,
    currentFunctionPreset,
  ]);

  useEffect(() => {
    if (route !== "learn" || activeModule !== "react") {
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const typeText = async (
      text: string,
      setter: (value: string) => void,
      step = 1,
      delay = 20,
    ) => {
      let current = "";

      for (let index = 0; index < text.length; index += step) {
        if (cancelled) {
          return;
        }

        current = text.slice(0, index + step);
        setter(current);
        await sleep(delay);
      }
    };

    const runDemo = async () => {
      setTypedReactInput("");
      setTypedReactThought("");
      setTypedReactToolCall("");
      setTypedReactServer("");
      setTypedReactObservation("");
      setTypedReactAnswer("");
      setActiveReactRound(0);
      setReactPlaybackComplete(false);
      setReactPhase("typing");

      await typeText(reactDemo.userInput, setTypedReactInput, 1, 18);
      if (cancelled) {
        return;
      }

      for (let index = 0; index < reactDemo.loops.length; index += 1) {
        const loop = reactDemo.loops[index];

        setActiveReactRound(index);
        setTypedReactThought("");
        setTypedReactToolCall("");
        setTypedReactServer("");
        setTypedReactObservation("");

        setReactPhase("thought");
        await typeText(loop.thought, setTypedReactThought, 2, 16);
        if (cancelled) {
          return;
        }

        await sleep(220);
        if (cancelled) {
          return;
        }

        setReactPhase("act");
        await typeText(loop.toolCall, setTypedReactToolCall, 2, 14);
        if (cancelled) {
          return;
        }

        await sleep(220);
        if (cancelled) {
          return;
        }

        setReactPhase("server");
        await typeText(loop.serverAction, setTypedReactServer, 2, 15);
        if (cancelled) {
          return;
        }

        await sleep(220);
        if (cancelled) {
          return;
        }

        setReactPhase("observe");
        await typeText(loop.observation, setTypedReactObservation, 2, 16);
        if (cancelled) {
          return;
        }

        if (index < reactDemo.loops.length - 1) {
          await sleep(180);
          if (cancelled) {
            return;
          }

          setReactPhase("loopback");
          await sleep(520);
          if (cancelled) {
            return;
          }
        }

        await sleep(360);
        if (cancelled) {
          return;
        }
      }

      setReactPhase("answer");
      await typeText(reactDemo.finalAnswer, setTypedReactAnswer, 2, 18);
      if (cancelled) {
        return;
      }

      setReactPhase("done");
      setReactPlaybackComplete(true);
    };

    void runDemo();

    return () => {
      cancelled = true;
    };
  }, [route, activeModule, reactRunSeed]);

  const phaseLabel =
    streamPhase === "typing"
      ? "正在输入问题"
      : streamPhase === "reading"
        ? "正在读取输入"
        : streamPhase === "thinking"
          ? "正在展开思考"
          : streamPhase === "answering"
            ? "正在流式输出"
            : "输出完成";

  const phaseHint = thinkEnabled
    ? "打开后，会先展示 <think> 思考流，再自动折叠。"
    : "关闭后，会跳过思考流，直接开始生成回答。";

  const replayDemo = () => {
    setRunSeed((value) => value + 1);
  };

  const systemPhaseLabel =
    systemPhase === "prompting"
      ? "正在加载系统提示词"
      : systemPhase === "typing"
        ? "正在输入用户问题"
        : systemPhase === "reading"
          ? "正在读取上下文"
          : systemPhase === "thinking"
            ? "正在展开思考"
            : systemPhase === "answering"
              ? "正在流式输出"
              : "输出完成";

  const systemPhaseHint = systemThinkEnabled
    ? "打开后，会先展示 <think> 思考流，再自动折叠。"
    : "关闭后，会跳过思考流，直接开始生成回答。";

  const replaySystemDemo = () => {
    setSystemRunSeed((value) => value + 1);
  };

  const structuredPhaseLabel =
    structuredPhase === "typing"
      ? "正在输入问题"
      : structuredPhase === "reading"
        ? "正在读取输入"
        : structuredPhase === "natural-thinking"
          ? "正在生成自然语言思路"
          : structuredPhase === "natural-output"
            ? "正在输出自然语言结果"
            : structuredPhase === "json-thinking"
              ? "正在生成结构化思路"
              : structuredPhase === "json-output"
                ? "正在输出 JSON"
                : "输出完成";

  const structuredPhaseHint = structuredThinkEnabled
    ? "打开后，会先展示两段 <think> 思考流，再输出自然语言和 JSON。"
    : "关闭后，会直接演示两种输出，不展示中间思考。";

  const replayStructuredDemo = () => {
    setStructuredRunSeed((value) => value + 1);
  };

  const functionPhaseLabel =
    functionPhase === "typing"
      ? "正在输入问题"
      : functionPhase === "thinking"
        ? "正在判断是否要调用函数"
        : functionPhase === "calling"
          ? "正在生成函数调用 JSON"
          : "输出完成";

  const functionPhaseHint = functionThinkEnabled
    ? "打开后，会先展示 <think>，再展示模型产出的 function call JSON。"
    : "关闭后，会跳过思考流，直接展示 function call JSON。";

  const replayFunctionDemo = () => {
    setFunctionRunSeed((value) => value + 1);
  };

  const reactPhaseLabel =
    reactPlaybackComplete && reactPhase === "done"
      ? "三轮已播放完成，点击下方轮次可切换查看"
      : reactPhase === "typing"
        ? "正在接收用户问题"
        : reactPhase === "thought"
          ? `正在进行 ${reactDemo.loops[activeReactRound]?.label || ""} Thought`
          : reactPhase === "act"
            ? `正在进行 ${reactDemo.loops[activeReactRound]?.label || ""} Act`
            : reactPhase === "server"
              ? "MCP server 正在执行工具"
              : reactPhase === "observe"
                ? `正在读取 ${reactDemo.loops[activeReactRound]?.label || ""} Observation`
                : reactPhase === "loopback"
                  ? "这一轮信息还不够，正在回到 Thought 开启下一轮"
                  : reactPhase === "answer"
                    ? "正在整理最终回答"
                    : "循环完成";

  const replayReactDemo = () => {
    setReactRunSeed((value) => value + 1);
  };

  const showReactRound = (roundIndex: number) => {
    const loop = reactDemo.loops[roundIndex];
    if (!loop) {
      return;
    }

    setActiveReactRound(roundIndex);
    setTypedReactInput(reactDemo.userInput);
    setTypedReactThought(loop.thought);
    setTypedReactToolCall(loop.toolCall);
    setTypedReactServer(loop.serverAction);
    setTypedReactObservation(loop.observation);
    setTypedReactAnswer(roundIndex === reactDemo.loops.length - 1 ? reactDemo.finalAnswer : "");
    setReactPhase(roundIndex === reactDemo.loops.length - 1 ? "done" : "loopback");
    setReactPlaybackComplete(true);
  };

  const reactFlowStepIndex =
    reactPhase === "typing"
      ? 0
      : reactPhase === "thought"
        ? 1
        : reactPhase === "act"
          ? 2
          : reactPhase === "server"
            ? 3
            : reactPhase === "observe" || reactPhase === "loopback"
              ? 4
              : 5;

  const isReactFinalRound = activeReactRound === reactDemo.loops.length - 1;
  const showReactFinal = isReactFinalRound && (typedReactAnswer || reactPhase === "answer" || reactPhase === "done");
  const showReactLoopback = !isReactFinalRound && (reactPhase === "loopback" || reactPlaybackComplete);
  const reactInputState =
    reactPhase === "typing" ? "is-active" : reactFlowStepIndex > 0 ? "is-complete" : "";
  const reactThoughtState =
    reactPhase === "thought"
      ? "is-active"
      : reactFlowStepIndex > 1 || reactPhase === "answer" || reactPhase === "done"
        ? "is-complete"
        : "";
  const reactActState =
    reactPhase === "act"
      ? "is-active"
      : reactFlowStepIndex > 2 || reactPhase === "answer" || reactPhase === "done"
        ? "is-complete"
        : "";
  const reactServerState =
    reactPhase === "server"
      ? "is-active"
      : reactFlowStepIndex > 3 || reactPhase === "answer" || reactPhase === "done"
        ? "is-complete"
        : "";
  const reactObservationState =
    reactPhase === "observe" || reactPhase === "loopback"
      ? "is-active"
      : reactPhase === "answer" || reactPhase === "done"
        ? "is-complete"
        : "";

  const runSearch = async (query = searchQuery, source = activeSearchSource) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSearchStatus("error");
      setSearchError("先输入一个主题词，再发起搜索。");
      setSearchItems([]);
      setSearchSummary("");
      setSearchHeading("");
      setSearchSource("");
      setSearchSourceLabel("聚合搜索结果");
      setSearchRequestPreview("");
      return;
    }

    setSearchStatus("loading");
    setSearchError("");

    try {
      let payload: SearchPayload;

      if (source === "wikipedia") {
        payload = await searchWikipedia(trimmedQuery, searchLimit);
      } else if (source === "github") {
        payload = await searchGitHubRepositories(trimmedQuery, searchLimit);
      } else if (source === "arxiv") {
        payload = await searchArxiv(trimmedQuery, searchLimit);
      } else {
        payload = await searchOpenLibrary(trimmedQuery, searchLimit);
      }

      const featured = payload.featured;

      setSearchHeading(featured?.title || trimmedQuery);
      setSearchSummary(featured?.text || "这次查询没有命中明显结果，你可以换个关键词再试。");
      setSearchSource(featured?.url || "");
      setSearchSourceLabel(featured?.source || currentSearchSource.label);
      setSearchItems(payload.items);
      setSearchRequestPreview(payload.requestPreview);
      setSearchStatus("success");
    } catch (error) {
      setSearchStatus("error");
      setSearchError(error instanceof Error ? error.message : "搜索失败");
      setSearchItems([]);
      setSearchSummary("");
      setSearchHeading("");
      setSearchSource("");
      setSearchSourceLabel("聚合搜索结果");
      setSearchRequestPreview("");
    }
  };

  const fullSearchUrl =
    activeSearchSource === "wikipedia"
      ? `https://zh.wikipedia.org/w/index.php?search=${encodeURIComponent(searchQuery)}`
      : activeSearchSource === "github"
        ? `https://github.com/search?q=${encodeURIComponent(searchQuery)}`
        : activeSearchSource === "arxiv"
          ? `https://arxiv.org/search/?query=${encodeURIComponent(searchQuery)}&searchtype=all`
          : `https://openlibrary.org/search?q=${encodeURIComponent(searchQuery)}`;
  const hasSearchContent = Boolean(searchSummary || searchSource || searchItems.length);

  useEffect(() => {
    if (route === "learn" && activeModule === "search" && searchStatus === "idle") {
      void runSearch(currentSearchSource.defaultQuery, activeSearchSource);
    }
  }, [route, activeModule, searchStatus, activeSearchSource, currentSearchSource.defaultQuery]);

  useEffect(() => {
    setSearchQuery(currentSearchSource.defaultQuery);
    setSearchStatus("idle");
    setSearchItems([]);
    setSearchSummary("");
    setSearchHeading("");
    setSearchSource("");
    setSearchSourceLabel("聚合搜索结果");
    setSearchRequestPreview("");
  }, [activeSearchSource, currentSearchSource.defaultQuery]);

  if (route === "learn") {
    return (
      <div className="learn-page">
        <header className="learn-topbar">
          <a className="back-link" href="#/">
            返回展示页
          </a>
          <div className="learn-brand">
            <span className="brand-mark" />
            <div>
              <p className="brand-title">学习区</p>
              <p className="brand-subtitle">从输入输出开始，一页页往后学</p>
            </div>
          </div>
        </header>

        <main className="learn-shell">
          <aside className="workspace-sidebar" aria-label="模块导航">
            {learningModules.map((module) => (
              <button
                className={`sidebar-item ${activeModule === module.id ? "is-active" : ""}`}
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                type="button"
              >
                <span className="sidebar-title">{module.title}</span>
                <span className="sidebar-subtitle">{module.subtitle}</span>
              </button>
            ))}
          </aside>

          <section className="workspace-panel">
            {activeModule === "io" ? (
              <>
                <div className="lesson-head">
                  <p className="eyebrow">第一页</p>
                  <h1>输入与输出</h1>
                  <p>
                    先只看最基础的一件事：你输入一句话，模型怎么一点点变成最终输出。别急着上工具，先把这一步看顺。
                  </p>
                </div>

                <div className="lesson-toolbar">
                  <button className="replay-button" onClick={replayDemo} type="button">
                    重新播放
                  </button>
                  <button
                    aria-pressed={thinkEnabled}
                    className={`think-switch ${thinkEnabled ? "is-on" : ""}`}
                    onClick={() => setThinkEnabled((value) => !value)}
                    type="button"
                  >
                    <span className="think-switch-copy">
                      <strong>思考开关</strong>
                      <small>{phaseHint}</small>
                    </span>
                    <span className="think-switch-track" aria-hidden="true">
                      <span className="think-switch-thumb" />
                    </span>
                  </button>
                </div>

                <div className="lesson-stage">
                  <section className="composer-card">
                    <div className="composer-head">
                      <span className="panel-label">输入</span>
                    </div>
                    <div className="composer-body">
                      <p>
                        {typedInput}
                        {streamPhase === "typing" ? (
                          <span className="stream-caret composer-caret" aria-hidden="true" />
                        ) : null}
                      </p>
                    </div>
                    <div className="composer-footer">
                      <span className="signal-dot" />
                      <span>这一层还没有工具、没有搜索，只有文本输入。</span>
                    </div>
                  </section>

                  <section className="stream-card" aria-live="polite">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">模型输出中</span>
                        <p className="stream-status">{phaseLabel}</p>
                      </div>
                      <div className="stream-pulse" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="stream-console">
                      <div className="stream-line">
                        <span className="stream-key">input</span>
                        <span className="stream-value">text prompt</span>
                      </div>
                      <div className="stream-line">
                        <span className="stream-key">mode</span>
                        <span className="stream-value">
                          {thinkEnabled ? "reasoning + streaming" : "streaming only"}
                        </span>
                      </div>

                      {thinkEnabled ? (
                        <div className="stream-think-wrap">
                          <button
                            className="think-block-head"
                            onClick={() => setIsThinkCollapsed((value) => !value)}
                            type="button"
                          >
                            <span className="stream-key">think</span>
                            <span className="think-block-state">
                              {isThinkCollapsed ? "已折叠" : "展开中"}
                            </span>
                          </button>

                          {isThinkCollapsed ? (
                            <div className="think-collapsed">
                              <p>思考流已展示完成并自动折叠，点击上方可以重新展开查看。</p>
                            </div>
                          ) : (
                            <pre className="think-stream">
                              {streamedThink}
                              {streamPhase === "thinking" ? (
                                <span className="stream-caret" aria-hidden="true" />
                              ) : null}
                            </pre>
                          )}
                        </div>
                      ) : null}

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">output</span>
                        <p className="stream-output">
                          {streamedOutput}
                          {streamPhase === "answering" ? (
                            <span className="stream-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="io-insights">
                  <article className="insight-card">
                    <span className="panel-label">观察点</span>
                    <p>{ioDemo.note}</p>
                  </article>
                  <article className="insight-card">
                    <span className="panel-label">这一步的重点</span>
                    <p>输入不是“随便问一句”这么简单。你写进输入里的对象、语气、结构要求，都会直接改变输出。</p>
                  </article>
                </div>
              </>
            ) : activeModule === "system" ? (
              <>
                <div className="lesson-head">
                  <p className="eyebrow">第二页</p>
                  <h1>系统提示词</h1>
                  <p>
                    这一页不再只看“用户说了什么”，而是看模型在正式回答前，被怎样设定身份、目标、边界和语气。
                  </p>
                </div>

                <div className="preset-switcher" role="tablist" aria-label="系统提示词示例">
                  {systemPromptDemos.map((preset) => (
                    <button
                      aria-selected={activeSystemPreset === preset.id}
                      className={`preset-chip ${activeSystemPreset === preset.id ? "is-active" : ""}`}
                      key={preset.id}
                      onClick={() => setActiveSystemPreset(preset.id)}
                      role="tab"
                      type="button"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="system-intro-card">
                  <span className="panel-label">当前示例</span>
                  <h2>{currentSystemPreset.title}</h2>
                  <p>{currentSystemPreset.subtitle}</p>
                </div>

                <div className="lesson-toolbar">
                  <button className="replay-button" onClick={replaySystemDemo} type="button">
                    重新播放
                  </button>
                  <button
                    aria-pressed={systemThinkEnabled}
                    className={`think-switch ${systemThinkEnabled ? "is-on" : ""}`}
                    onClick={() => setSystemThinkEnabled((value) => !value)}
                    type="button"
                  >
                    <span className="think-switch-copy">
                      <strong>思考开关</strong>
                      <small>{systemPhaseHint}</small>
                    </span>
                    <span className="think-switch-track" aria-hidden="true">
                      <span className="think-switch-thumb" />
                    </span>
                  </button>
                </div>

                <div className="system-stage">
                  <div className="system-stage-stack">
                    <section className="system-prompt-card">
                      <div className="composer-head">
                        <span className="panel-label">System Prompt</span>
                      </div>
                      <pre className="system-prompt-body">{typedSystemPrompt}</pre>
                    </section>

                    <section className="composer-card system-user-card">
                      <div className="composer-head">
                        <span className="panel-label">用户输入</span>
                      </div>
                      <div className="composer-body system-user-body">
                        <p>
                          {typedSystemInput}
                          {systemPhase === "typing" ? (
                            <span className="stream-caret composer-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                    </section>
                  </div>

                  <section className="stream-card" aria-live="polite">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">系统提示词生效中</span>
                        <p className="stream-status">{systemPhaseLabel}</p>
                      </div>
                      <div className="stream-pulse" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="stream-console">
                      <div className="stream-line">
                        <span className="stream-key">role</span>
                        <span className="stream-value">{currentSystemPreset.label}</span>
                      </div>
                      <div className="stream-line">
                        <span className="stream-key">mode</span>
                        <span className="stream-value">
                          {systemThinkEnabled ? "system prompt + reasoning" : "system prompt only"}
                        </span>
                      </div>

                      {systemThinkEnabled ? (
                        <div className="stream-think-wrap">
                          <button
                            className="think-block-head"
                            onClick={() => setIsSystemThinkCollapsed((value) => !value)}
                            type="button"
                          >
                            <span className="stream-key">think</span>
                            <span className="think-block-state">
                              {isSystemThinkCollapsed ? "已折叠" : "展开中"}
                            </span>
                          </button>

                          {isSystemThinkCollapsed ? (
                            <div className="think-collapsed">
                              <p>思考流已展示完成并自动折叠，点击上方可以重新展开查看。</p>
                            </div>
                          ) : (
                            <pre className="think-stream">
                              {streamedSystemThink}
                              {systemPhase === "thinking" ? (
                                <span className="stream-caret" aria-hidden="true" />
                              ) : null}
                            </pre>
                          )}
                        </div>
                      ) : null}

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">output</span>
                        <p className="stream-output">
                          {streamedSystemOutput}
                          {systemPhase === "answering" ? (
                            <span className="stream-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="io-insights">
                  <article className="insight-card">
                    <span className="panel-label">观察点</span>
                    <p>{currentSystemPreset.note}</p>
                  </article>
                  <article className="insight-card">
                    <span className="panel-label">这一页的重点</span>
                    <p>
                      system prompt 不只是“加一句设定”。它会提前规定模型的身份、结构、语气和边界，所以连思考路径和最后输出都会一起被塑形。
                    </p>
                  </article>
                </div>
              </>
            ) : activeModule === "structured" ? (
              <>
                <div className="lesson-head">
                  <p className="eyebrow">第三页</p>
                  <h1>结构化输出</h1>
                  <p>
                    同一个问题，模型可以像人一样写一段自然语言，也可以按你规定的字段输出 JSON。这一步，是从“能看”走向“能编程”。
                  </p>
                </div>

                <div className="lesson-toolbar">
                  <button className="replay-button" onClick={replayStructuredDemo} type="button">
                    重新播放
                  </button>
                  <button
                    aria-pressed={structuredThinkEnabled}
                    className={`think-switch ${structuredThinkEnabled ? "is-on" : ""}`}
                    onClick={() => setStructuredThinkEnabled((value) => !value)}
                    type="button"
                  >
                    <span className="think-switch-copy">
                      <strong>思考开关</strong>
                      <small>{structuredPhaseHint}</small>
                    </span>
                    <span className="think-switch-track" aria-hidden="true">
                      <span className="think-switch-thumb" />
                    </span>
                  </button>
                </div>

                <div className="structured-shell">
                  <div className="structured-inputs">
                    <section className="composer-card">
                      <div className="composer-head">
                        <span className="panel-label">用户输入</span>
                      </div>
                      <div className="composer-body structured-input-body">
                        <p>
                          {typedStructuredInput}
                          {structuredPhase === "typing" ? (
                            <span className="stream-caret composer-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                    </section>

                    <section className="schema-card">
                      <div className="composer-head">
                        <span className="panel-label">目标 JSON 结构</span>
                      </div>
                      <pre className="schema-pre">{structuredOutputDemo.schema}</pre>
                    </section>
                  </div>

                  <section className="stream-card" aria-live="polite">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">自然语言输出</span>
                        <p className="stream-status">{structuredPhaseLabel}</p>
                      </div>
                      <div className="stream-pulse" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="stream-console">
                      <div className="stream-line">
                        <span className="stream-key">mode</span>
                        <span className="stream-value">plain answer</span>
                      </div>

                      {structuredThinkEnabled ? (
                        <div className="stream-think-wrap">
                          <button
                            className="think-block-head"
                            onClick={() => setIsNaturalThinkCollapsed((value) => !value)}
                            type="button"
                          >
                            <span className="stream-key">think</span>
                            <span className="think-block-state">
                              {isNaturalThinkCollapsed ? "已折叠" : "展开中"}
                            </span>
                          </button>

                          {isNaturalThinkCollapsed ? (
                            <div className="think-collapsed">
                              <p>自然语言思考流已完成，点击上方可以重新展开。</p>
                            </div>
                          ) : (
                            <pre className="think-stream">
                              {streamedNaturalThink}
                              {structuredPhase === "natural-thinking" ? (
                                <span className="stream-caret" aria-hidden="true" />
                              ) : null}
                            </pre>
                          )}
                        </div>
                      ) : null}

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">output</span>
                        <p className="stream-output">
                          {streamedNaturalOutput}
                          {structuredPhase === "natural-output" ? (
                            <span className="stream-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="stream-card structured-json-card" aria-live="polite">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">结构化输出</span>
                        <p className="stream-status">同一个输入，被约束成固定字段</p>
                      </div>
                      <div className="stream-pulse" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="stream-console">
                      <div className="stream-line">
                        <span className="stream-key">mode</span>
                        <span className="stream-value">json object</span>
                      </div>

                      {structuredThinkEnabled ? (
                        <div className="stream-think-wrap">
                          <button
                            className="think-block-head"
                            onClick={() => setIsJsonThinkCollapsed((value) => !value)}
                            type="button"
                          >
                            <span className="stream-key">think</span>
                            <span className="think-block-state">
                              {isJsonThinkCollapsed ? "已折叠" : "展开中"}
                            </span>
                          </button>

                          {isJsonThinkCollapsed ? (
                            <div className="think-collapsed">
                              <p>JSON 思考流已完成，点击上方可以重新展开。</p>
                            </div>
                          ) : (
                            <pre className="think-stream">
                              {streamedStructuredThink}
                              {structuredPhase === "json-thinking" ? (
                                <span className="stream-caret" aria-hidden="true" />
                              ) : null}
                            </pre>
                          )}
                        </div>
                      ) : null}

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">output</span>
                        <pre className="stream-output stream-output-json">
                          {streamedStructuredOutput}
                          {structuredPhase === "json-output" ? (
                            <span className="stream-caret" aria-hidden="true" />
                          ) : null}
                        </pre>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="io-insights">
                  <article className="insight-card">
                    <span className="panel-label">观察点</span>
                    <p>{structuredOutputDemo.note}</p>
                  </article>
                  <article className="insight-card">
                    <span className="panel-label">这一页的重点</span>
                    <p>
                      结构化输出的关键不是“看起来像 JSON”，而是字段稳定、键名稳定、程序可以直接拿去渲染、存库或继续传给下一个函数。
                    </p>
                  </article>
                </div>
              </>
            ) : activeModule === "function" ? (
              <>
                <div className="lesson-head">
                  <p className="eyebrow">第四页</p>
                  <h1>Function Calling</h1>
                  <p>
                    这一页只看模型侧。重点不是函数怎么执行，而是模型在看到 tools 说明书后，怎样判断该不该调工具，并产出一段调用 JSON。
                  </p>
                </div>

                <div className="preset-switcher" role="tablist" aria-label="函数调用示例">
                  {functionCallDemos.map((preset) => (
                    <button
                      aria-selected={activeFunctionPreset === preset.id}
                      className={`preset-chip ${activeFunctionPreset === preset.id ? "is-active" : ""}`}
                      key={preset.id}
                      onClick={() => setActiveFunctionPreset(preset.id)}
                      role="tab"
                      type="button"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="system-intro-card">
                  <span className="panel-label">当前示例</span>
                  <h2>{currentFunctionPreset.title}</h2>
                  <p>{currentFunctionPreset.subtitle}</p>
                </div>

                <div className="function-compare-grid">
                  <article className="compare-card">
                    <span className="panel-label">Tools 是什么</span>
                    <p className="compare-title">它不是函数源码，而是程序提前塞给模型的一份“工具说明书”</p>
                    <p>
                      你可以把 tools 理解成一张“可用工具清单”。模型平时并不会自动读取时间、天气或数据库，只有当程序把函数描述放进上下文里，它才知道自己有哪些外部能力可以调用。
                    </p>
                    <p className="compare-subtitle">当前这个示例里的 tools，可以这样拆开看：</p>
                    <div className="tool-guide-list">
                      {currentFunctionPreset.toolGuide.map((item) => (
                        <div className="tool-guide-item" key={item.key}>
                          <span className="tool-guide-key">{item.key}</span>
                          <p className="tool-guide-meaning">{item.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="compare-card compare-card-muted">
                    <span className="panel-label">不带 tools</span>
                    <p className="compare-title">模型没有“可调用说明书”，就只能直接回答或保守兜底</p>
                    <p>{currentFunctionPreset.withoutToolsOutput}</p>
                  </article>
                </div>

                <div className="lesson-toolbar">
                  <button className="replay-button" onClick={replayFunctionDemo} type="button">
                    重新播放
                  </button>
                  <button
                    aria-pressed={functionThinkEnabled}
                    className={`think-switch ${functionThinkEnabled ? "is-on" : ""}`}
                    onClick={() => setFunctionThinkEnabled((value) => !value)}
                    type="button"
                  >
                    <span className="think-switch-copy">
                      <strong>思考开关</strong>
                      <small>{functionPhaseHint}</small>
                    </span>
                    <span className="think-switch-track" aria-hidden="true">
                      <span className="think-switch-thumb" />
                    </span>
                  </button>
                </div>

                <div className="function-shell">
                  <section className="composer-card">
                    <div className="composer-head">
                      <span className="panel-label">发给模型的上下文</span>
                    </div>
                    <div className="function-context-body">
                      <div className="function-context-block">
                        <span className="function-context-label">user prompt</span>
                        <p className="function-context-prompt">
                          {typedFunctionInput}
                          {functionPhase === "typing" ? (
                            <span className="stream-caret composer-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                      <div className="function-context-block">
                        <span className="function-context-label">tools</span>
                        <pre className="function-context-tools">{currentFunctionPreset.toolSpec}</pre>
                        <p className="function-context-help">
                          这里展示的不是函数代码本体，而是给模型看的“函数说明书”：函数叫什么、是干什么的、要传哪些参数。
                        </p>
                      </div>
                    </div>
                    <div className="composer-footer">
                      <span className="signal-dot" />
                      <span>这一页到此为止都还是模型侧视角，还没有进入函数执行环节。</span>
                    </div>
                  </section>

                  <section className="stream-card" aria-live="polite">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">模型输出</span>
                        <p className="stream-status">{functionPhaseLabel}</p>
                      </div>
                      <div className="stream-pulse" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="stream-console">
                      <div className="stream-line">
                        <span className="stream-key">mode</span>
                        <span className="stream-value">function calling only</span>
                      </div>

                      {functionThinkEnabled ? (
                        <div className="stream-think-wrap">
                          <button
                            className="think-block-head"
                            onClick={() => setIsFunctionThinkCollapsed((value) => !value)}
                            type="button"
                          >
                            <span className="stream-key">think</span>
                            <span className="think-block-state">
                              {isFunctionThinkCollapsed ? "已折叠" : "展开中"}
                            </span>
                          </button>

                          {isFunctionThinkCollapsed ? (
                            <div className="think-collapsed">
                              <p>函数决策思路已展示完成，点击上方可以重新展开。</p>
                            </div>
                          ) : (
                            <pre className="think-stream">
                              {streamedFunctionThink}
                              {functionPhase === "thinking" ? (
                                <span className="stream-caret" aria-hidden="true" />
                              ) : null}
                            </pre>
                          )}
                        </div>
                      ) : null}

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">tool_call</span>
                        <pre className="stream-output stream-output-json">
                          {streamedFunctionCall}
                          {functionPhase === "calling" ? (
                            <span className="stream-caret" aria-hidden="true" />
                          ) : null}
                        </pre>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="io-insights">
                  <article className="insight-card">
                    <span className="panel-label">观察点</span>
                    <p>{currentFunctionPreset.note}</p>
                  </article>
                  <article className="insight-card">
                    <span className="panel-label">这一页的重点</span>
                    <p>
                      function calling 的边界很明确：模型先看 tools 定义，再决定是否调用，并产出一段 JSON。至于真正执行函数、拿回结果，那已经是下一页 MCP 或宿主程序的工作。
                    </p>
                  </article>
                </div>
              </>
            ) : activeModule === "mcp" ? (
              <>
                <div className="lesson-head">
                  <p className="eyebrow">第五页</p>
                  <h1>MCP</h1>
                  <p>
                    这一页开始进入系统侧。MCP 不是让模型“更会调用”，而是把真实函数实现、tools 描述和执行流程封装进一个 server，让客户端能把模型的 function call 正确转发过去。
                  </p>
                </div>

                <div className="mcp-plain-grid">
                  {mcpPlainFacts.map((item) => (
                    <article className="compare-card" key={item.title}>
                      <span className="panel-label">{item.label}</span>
                      <p className="compare-title">{item.title}</p>
                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>

                <div className="mcp-difference-card">
                  <div className="system-intro-card">
                    <span className="panel-label">一句话区别</span>
                    <h2>Function Calling 解决“怎么调”，MCP 解决“怎么接”</h2>
                    <p>
                      模型先根据 tools 说明书，产出工具名和参数；客户端再根据 MCP 的接入关系，把这段调用 JSON 转发到真正的工具 server 去执行。
                    </p>
                  </div>

                  <div className="mcp-difference-table" role="table" aria-label="Function Calling 与 MCP 对比">
                    <div className="mcp-difference-row mcp-difference-head" role="row">
                      <span role="columnheader">对比点</span>
                      <span role="columnheader">Function Calling</span>
                      <span role="columnheader">MCP</span>
                    </div>
                    {mcpDifferenceRows.map((item) => (
                      <div className="mcp-difference-row" key={item.point} role="row">
                        <span role="cell">{item.point}</span>
                        <span role="cell">{item.functionCalling}</span>
                        <span role="cell">{item.mcp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="provider-grid">
                  {mcpCoreParts.map((item) => (
                    <article className="topic-card" key={item.title}>
                      <span className="panel-label">{item.label}</span>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>

                <div className="mcp-demo-shell">
                  <section className="composer-card">
                    <div className="composer-head">
                      <span className="panel-label">server 视角</span>
                    </div>
                    <div className="function-context-body">
                      <div className="function-context-block">
                        <span className="function-context-label">用户问题</span>
                        <p className="function-context-prompt">{mcpDemoScenario.userRequest}</p>
                      </div>
                      <div className="function-context-block">
                        <span className="function-context-label">模型看到的 tools</span>
                        <pre className="function-context-tools">{mcpDemoScenario.tools}</pre>
                      </div>
                      <div className="function-context-block">
                        <span className="function-context-label">这一页新增的信息</span>
                        <p className="function-context-help">
                          到这里都还是 Function Calling 语境。MCP 这一页真正新增的是：这些 tools 背后连着一个 MCP server，而 server 里面有真实函数实现。
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="stream-card" aria-live="polite">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">调用链路演示</span>
                        <p className="stream-status">先发起 function call，再由 MCP 路由到真实工具</p>
                      </div>
                      <div className="stream-pulse" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="stream-console">
                      <div className="stream-line stream-line-live">
                        <span className="stream-key">tool call</span>
                        <pre className="stream-output stream-output-json">{mcpDemoScenario.functionCall}</pre>
                      </div>

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">client</span>
                        <p className="stream-output">{mcpDemoScenario.clientAction}</p>
                      </div>

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">mcp server</span>
                        <p className="stream-output">{mcpDemoScenario.serverAction}</p>
                      </div>

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">result</span>
                        <pre className="stream-output stream-output-json">{mcpDemoScenario.serverResult}</pre>
                      </div>

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">final</span>
                        <p className="stream-output">{mcpDemoScenario.finalAnswer}</p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="system-intro-card">
                  <span className="panel-label">严谨一点</span>
                  <h2>不是模型直接执行 MCP，而是客户端代为转发</h2>
                  <p>{mcpClarifyNote}</p>
                </div>

                <div className="mcp-flow-grid">
                  {mcpFlowSteps.map((step) => (
                    <article className="mcp-step-card" key={step.label}>
                      <span className="panel-label">{step.label}</span>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </article>
                  ))}
                </div>

                <div className="mcp-compare-grid">
                  {mcpComparisons.map((item) => (
                    <article className="compare-card compare-card-muted" key={item.title}>
                      <span className="panel-label">{item.title}</span>
                      <p className="compare-title">
                        {item.title === "Function Calling" ? "模型侧调用格式" : "系统侧接入协议"}
                      </p>
                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>

                <div className="provider-grid">
                  {mcpExamples.map((item) => (
                    <article className="topic-card" key={item.title}>
                      <span className="panel-label">MCP 示例</span>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>

                <div className="provider-grid">
                  {mcpMisconceptions.map((item) => (
                    <article className="topic-card" key={item.title}>
                      <span className="panel-label">常见误区</span>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>

                <div className="io-insights">
                  <article className="insight-card">
                    <span className="panel-label">现实限制</span>
                    {mcpRealityNotes.map((note) => (
                      <p className="mcp-note" key={note}>
                        {note}
                      </p>
                    ))}
                  </article>
                  <article className="insight-card">
                    <span className="panel-label">这一页的重点</span>
                    <p>
                      以后你在 Agent 里看到“模型调用工具”，先别急着把 MCP 和 Function Calling 混成一个词。一个更像调用格式，一个更像接入层基础设施。
                    </p>
                  </article>
                </div>
              </>
            ) : activeModule === "search" ? (
              <>
                <div className="lesson-head">
                  <p className="eyebrow">第六页</p>
                  <h1>搜索</h1>
                  <p>
                    模型并不天然知道最新网页信息，所以很多时候要先走搜索。受限于纯前端、免 key 这组条件，这一页只展示 4 类公开可接的搜索源；真正的通用搜索更接近百度、必应这类实时搜索引擎，覆盖更广、效果也通常更好。
                  </p>
                </div>

                <div className="preset-switcher" role="tablist" aria-label="搜索来源示例">
                  {searchSourceDemos.map((source) => (
                    <button
                      aria-selected={activeSearchSource === source.id}
                      className={`preset-chip ${activeSearchSource === source.id ? "is-active" : ""}`}
                      key={source.id}
                      onClick={() => setActiveSearchSource(source.id as SearchSourceId)}
                      role="tab"
                      type="button"
                    >
                      {source.label}
                    </button>
                  ))}
                </div>

                <div className="system-intro-card">
                  <span className="panel-label">当前来源</span>
                  <h2>{currentSearchSource.title}</h2>
                  <p>{currentSearchSource.subtitle}</p>
                </div>

                <div className="function-compare-grid">
                  <article className="compare-card">
                    <span className="panel-label">这一页在演示什么</span>
                    <p className="compare-title">这 4 个来源都能纯前端直连，但它们搜索的不是同一个世界</p>
                    <p>
                      Wikipedia 更像百科词条，GitHub 更像代码仓库搜索，arXiv 更像论文搜索，Open Library 更像图书检索。它们都能拿来教学，但都不等于真正的通用网页搜索。
                    </p>
                    <p className="compare-subtitle">
                      这也是为什么实际通用搜索更接近百度、必应这类搜索引擎：实时性更强、覆盖范围更广、搜人物和热点通常更自然。
                    </p>
                  </article>
                </div>

                <div className="search-shell">
                  <section className="search-control-card">
                    <div className="composer-head">
                      <span className="panel-label">真实搜索演示</span>
                    </div>

                    <form
                      className="search-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        void runSearch();
                      }}
                    >
                      <label className="search-field">
                        <span>主题词</span>
                        <input
                          onChange={(event) => setSearchQuery(event.target.value)}
                          placeholder="例如：system prompt / RAG / LangChain"
                          type="text"
                          value={searchQuery}
                        />
                      </label>

                      <label className="search-field">
                        <span>展示数量</span>
                        <input
                          max={10}
                          min={1}
                          onChange={(event) =>
                            setSearchLimit(Math.max(1, Math.min(10, Number(event.target.value) || 1)))
                          }
                          type="number"
                          value={searchLimit}
                        />
                      </label>

                      <div className="search-actions">
                        <button className="button button-primary search-button" type="submit">
                          开始搜索
                        </button>
                        <p className="search-helper">
                          这一步会直接请求当前 tab 对应的公开搜索源。
                        </p>
                      </div>
                    </form>

                    <div className="search-chip-row">
                      {(
                        activeSearchSource === "wikipedia"
                          ? [currentSearchSource.defaultQuery, "北京", "人工智能"]
                          : activeSearchSource === "github"
                            ? [currentSearchSource.defaultQuery, "langchain", "transformers"]
                            : activeSearchSource === "arxiv"
                              ? [currentSearchSource.defaultQuery, "RAG", "transformer"]
                              : [currentSearchSource.defaultQuery, "The Three-Body Problem", "The Hobbit"]
                      ).map((example) => (
                        <button
                          className="search-chip"
                          key={example}
                          onClick={() => {
                            setSearchQuery(example);
                            void runSearch(example);
                          }}
                          type="button"
                        >
                          {example}
                        </button>
                      ))}
                    </div>

                    <div className="search-request-card">
                      <span className="function-context-label">aggregation preview</span>
                      <pre className="compare-pre">{searchRequestPreview || `query = "${searchQuery}"`}</pre>
                    </div>
                  </section>

                  <section className="search-results-card">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">返回结果</span>
                        <p className="stream-status">
                          {searchStatus === "loading"
                            ? "正在请求搜索源"
                            : searchStatus === "error"
                              ? "请求失败"
                              : searchStatus === "success"
                                ? "请求完成"
                                : "等待搜索"}
                        </p>
                      </div>
                      {searchStatus === "loading" ? (
                        <div className="stream-pulse" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </div>
                      ) : null}
                    </div>

                    {searchStatus === "error" ? (
                      <div className="search-empty">
                        <p>{searchError}</p>
                      </div>
                    ) : null}

                    {searchStatus === "success" ? (
                      <div className="search-results-stack">
                        <article className="search-summary-card">
                          <span className="panel-label">Top 1 · {searchSourceLabel}</span>
                          <h2>{searchHeading || searchQuery}</h2>
                          <p>
                            {searchSummary ||
                              "这一条查询没有返回明显的摘要，但仍然可能返回相关主题。"}
                          </p>
                          {searchSource ? (
                              <a className="search-link" href={searchSource} rel="noreferrer" target="_blank">
                              查看来源
                              </a>
                          ) : null}
                        </article>

                        <div className="search-related-grid">
                          {searchItems.length > 0 ? (
                            searchItems.map((item, index) => (
                              <article className="search-item-card" key={`${item.title}-${index}`}>
                                <span className="panel-label">
                                  Top {index + 2} · {item.source}
                                </span>
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                                {item.url ? (
                                  <a className="search-link" href={item.url} rel="noreferrer" target="_blank">
                                    打开条目
                                  </a>
                                ) : null}
                              </article>
                            ))
                          ) : (
                            <div className="search-empty">
                              <p>
                                {!hasSearchContent
                                  ? "这次没有命中明显结果。你可以换一个词再试，或者直接打开对应站点的搜索页。"
                                  : "这次只有一条特别明显的命中结果；你可以换一个词再试，或者直接打开对应站点的搜索页。"}
                              </p>
                              <a className="search-link" href={fullSearchUrl} rel="noreferrer" target="_blank">
                                打开对应站点的搜索页
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </section>
                </div>

                <div className="provider-grid">
                  {searchApiNotes.map((item) => (
                    <article className="topic-card" key={item.title}>
                      <span className="panel-label">同类能力</span>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>

                <div className="io-insights">
                  <article className="insight-card">
                    <span className="panel-label">观察点</span>
                    <p>
                      搜索 API 的共同点是“把外部信息拿回来”，但它们拿回来的世界不一样。有的偏网页摘要，有的偏开发者检索，有的偏平台内内容。
                    </p>
                  </article>
                  <article className="insight-card">
                    <span className="panel-label">这一页的重点</span>
                    <p>
                      这一页最重要的不是结果有多全，而是让人直观看到：当模型需要外部信息时，搜索接口会先把信息取回来，再交给后续流程继续处理。
                    </p>
                  </article>
                </div>
              </>
            ) : activeModule === "react" ? (
              <>
                <div className="lesson-head">
                  <p className="eyebrow">第七页</p>
                  <h1>ReAct 循环</h1>
                  <p>
                    ReAct 不是一个玄学词，你可以把它理解成“边想边查边修正”的工作流。像一个靠谱的实习生，先判断信息够不够，不够就去查，查完再回来继续想。
                  </p>
                </div>

                <div className="system-intro-card">
                  <span className="panel-label">先用比喻理解</span>
                  <h2>不是一口气想完，而是想一点、查一点、再回来</h2>
                  <p>{reactDemo.analogy}</p>
                </div>

                <div className="lesson-toolbar">
                  <button className="replay-button" onClick={replayReactDemo} type="button">
                    重新播放
                  </button>
                </div>

                <div className="react-shell">
                  <section className="composer-card react-context-card">
                    <div className="composer-head">
                      <span className="panel-label">上下文准备</span>
                    </div>
                    <div className="function-context-body">
                      <div className="function-context-block">
                        <span className="function-context-label">user input</span>
                        <p className="function-context-prompt">
                          {typedReactInput}
                          {reactPhase === "typing" ? (
                            <span className="stream-caret composer-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                      <div className="function-context-block">
                        <span className="function-context-label">system prompt</span>
                        <p className="function-context-help">{reactDemo.systemPrompt}</p>
                      </div>
                      <div className="function-context-block">
                        <span className="function-context-label">tools</span>
                        <pre className="function-context-tools">{reactDemo.tools}</pre>
                      </div>
                      <div className="function-context-block">
                        <span className="function-context-label">MCP server</span>
                        <p className="function-context-help">{reactDemo.mcpServer}</p>
                      </div>
                    </div>
                  </section>

                  <section className="stream-card react-board" aria-live="polite">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">循环动线</span>
                        <p className="stream-status">{reactPhaseLabel}</p>
                      </div>
                      <div className="stream-pulse" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="preset-switcher react-round-switcher" role="tablist" aria-label="轮次切换">
                      {reactDemo.loops.map((loop, index) => (
                        <button
                          aria-selected={activeReactRound === index}
                          className={`preset-chip ${activeReactRound === index ? "is-active" : ""}`}
                          disabled={!reactPlaybackComplete}
                          key={loop.label}
                          onClick={() => showReactRound(index)}
                          role="tab"
                          type="button"
                        >
                          {loop.label}
                        </button>
                      ))}
                    </div>

                    <div className="react-cycle">
                      <div className={`react-cycle-node react-cycle-node-input ${reactInputState}`}>
                        <span>用户问题</span>
                      </div>
                      <div
                        className={`react-cycle-line react-cycle-line-top-left ${
                          reactFlowStepIndex > 0 ? "is-complete" : ""
                        } ${reactPhase === "typing" ? "is-live" : ""}`}
                      />
                      <div className={`react-cycle-node react-cycle-node-thought ${reactThoughtState}`}>
                        <span>Thought</span>
                      </div>
                      <div
                        className={`react-cycle-line react-cycle-line-top-right ${
                          reactFlowStepIndex > 2 ? "is-complete" : ""
                        } ${reactPhase === "act" ? "is-live" : ""}`}
                      />
                      <div className={`react-cycle-node react-cycle-node-act ${reactActState}`}>
                        <span>Act</span>
                      </div>

                      <div
                        className={`react-cycle-line react-cycle-line-down ${
                          reactFlowStepIndex > 2 ? "is-complete" : ""
                        } ${reactPhase === "act" ? "is-live" : ""}`}
                      />
                      <div className={`react-cycle-node react-cycle-node-server ${reactServerState}`}>
                        <span>MCP Server</span>
                      </div>
                      <div
                        className={`react-cycle-line react-cycle-line-bottom ${
                          reactFlowStepIndex > 3 ? "is-complete" : ""
                        } ${reactPhase === "server" ? "is-live" : ""}`}
                      />
                      <div className={`react-cycle-node react-cycle-node-observe ${reactObservationState}`}>
                        <span>Observation</span>
                      </div>

                      <div
                        className={`react-cycle-line react-cycle-line-left ${
                          reactPhase === "answer" || reactPhase === "done" || reactPlaybackComplete
                            ? "is-complete"
                            : ""
                        } ${reactPhase === "loopback" ? "is-live" : ""}`}
                      />
                    </div>

                    <p className={`react-cycle-loop-text ${showReactLoopback ? "is-visible" : ""}`}>
                      信息还不够，带着 Observation 回到 Thought 再想一轮
                    </p>

                    <div className={`react-final-stage ${showReactFinal ? "is-visible" : ""}`}>
                      <div className={`react-final-stage-line ${reactPhase === "answer" ? "is-live" : ""}`} />
                      <div className={`react-final-stage-node ${showReactFinal ? "is-active" : ""}`}>
                        <span>最终回答</span>
                      </div>
                    </div>

                    <div className="stream-console react-console">
                      <div className="stream-line">
                        <span className="stream-key">round</span>
                        <span className="stream-value">{reactDemo.loops[activeReactRound]?.label}</span>
                      </div>
                      <div className="stream-line">
                        <span className="stream-key">goal</span>
                        <span className="stream-value">{reactDemo.loops[activeReactRound]?.goal}</span>
                      </div>

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">thought</span>
                        <p className="stream-output">
                          {typedReactThought}
                          {reactPhase === "thought" ? <span className="stream-caret" aria-hidden="true" /> : null}
                        </p>
                      </div>

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">tool call</span>
                        <pre className="stream-output stream-output-json">
                          {typedReactToolCall}
                          {reactPhase === "act" ? <span className="stream-caret" aria-hidden="true" /> : null}
                        </pre>
                      </div>

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">server</span>
                        <p className="stream-output">
                          {typedReactServer}
                          {reactPhase === "server" ? <span className="stream-caret" aria-hidden="true" /> : null}
                        </p>
                      </div>

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">observe</span>
                        <p className="stream-output">
                          {typedReactObservation}
                          {reactPhase === "observe" ? <span className="stream-caret" aria-hidden="true" /> : null}
                        </p>
                      </div>

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">final</span>
                        {showReactFinal ? (
                          <p className="stream-output">
                            {typedReactAnswer}
                            {reactPhase === "answer" ? <span className="stream-caret" aria-hidden="true" /> : null}
                          </p>
                        ) : (
                          <p className="stream-output stream-output-muted">
                            这一轮还不会直接给最终答案，而是带着 Observation 回到 Thought，开始下一轮判断。
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                </div>

                <div className="react-round-grid">
                  {reactDemo.loops.map((loop, index) => (
                    <button
                      className={`topic-card react-round-card ${activeReactRound === index ? "is-active" : ""}`}
                      disabled={!reactPlaybackComplete}
                      key={loop.label}
                      onClick={() => showReactRound(index)}
                      type="button"
                    >
                      <span className="panel-label">{loop.label}</span>
                      <h3>{loop.goal}</h3>
                      <p>{loop.observation}</p>
                    </button>
                  ))}
                </div>

                <div className="provider-grid">
                  {reactExplainCards.map((item) => (
                    <article className="topic-card" key={item.title}>
                      <span className="panel-label">讲人话版</span>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>

                <div className="io-insights">
                  <article className="insight-card">
                    <span className="panel-label">怎样实现</span>
                    {reactImplementationNotes.map((note) => (
                      <p className="mcp-note" key={note}>
                        {note}
                      </p>
                    ))}
                  </article>
                  <article className="insight-card">
                    <span className="panel-label">这一页的重点</span>
                    <p>
                      ReAct 的本质不是“多想几步”，而是让模型在每一轮里决定：现在该继续想，还是该去行动。只要外部信息会改变下一步判断，这个循环就很有价值。
                    </p>
                  </article>
                </div>
              </>
            ) : (
              <div className="placeholder-panel">
                <span className="panel-label">下一步</span>
                <h2>
                  {learningModules.find((module) => module.id === activeModule)?.title ?? "模块"}
                </h2>
                <p>这个模块下一步继续开发。当前先把第一页“输入与输出”做扎实。</p>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="hero">
        <nav className="nav">
          <div className="brand">
            <span className="brand-mark" />
            <div>
              <p className="brand-title">AI 架构可视化</p>
              <p className="brand-subtitle">给懂一点代码的小白看的入门站</p>
            </div>
          </div>

          <div className="nav-links">
            <a href="#topics">入门目录</a>
            <a href="#example">示例</a>
            <a href="#api">API</a>
          </div>
        </nav>

        <div className="hero-atmosphere" aria-hidden="true">
          <span className="glow glow-1" />
          <span className="glow glow-2" />
          <span className="glow glow-3" />
          <div className="grid-orbit" />
        </div>

        <section className="hero-copy">
          <p className="eyebrow">从 Prompt 到 ReAct</p>
          <h1>先把 AI 入门部分，一次看明白。</h1>
          <p className="hero-text">
            提示词、系统提示词、输出、结构化输出、Function Calling、MCP、搜索、ReAct 循环。
            先把这 7 个点讲透，再往后走。
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#/learn">
              开始学习
            </a>
            <a className="button button-secondary" href="#example">
              先看示例
            </a>
          </div>
        </section>

        <section className="stage" aria-label="首页示意">
          {examplePanels.map((panel, index) => (
            <div className={`stage-panel stage-panel-${index + 1}`} key={panel.label}>
              <span className="panel-label">{panel.label}</span>
              <pre>{panel.value}</pre>
            </div>
          ))}
        </section>

        <div className="pill-row">
          {stagePills.map((pill) => (
            <span className="pill" key={pill}>
              {pill}
            </span>
          ))}
        </div>
      </header>

      <main className="main">
        <section className="section" id="topics">
          <div className="section-heading">
            <p className="eyebrow">入门目录</p>
            <h2>这一阶段先学这 7 个点。</h2>
          </div>

          <div className="topic-grid">
            {introTopics.map((topic) => (
              <article className="topic-card" key={topic.index}>
                <span className="topic-index">{topic.index}</span>
                <h3>{topic.title}</h3>
                <p>{topic.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="example">
          <div className="section-heading">
            <p className="eyebrow">开篇示例</p>
            <h2>这一页先让你看到输入如何被约束，然后再进入学习区。</h2>
          </div>

          <div className="topic-grid">
            {examplePanels.map((panel) => (
              <article className="topic-card" key={panel.label}>
                <span className="topic-index">{panel.label}</span>
                <pre className="topic-pre">{panel.value}</pre>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="api">
          <div className="section-heading">
            <p className="eyebrow">静态站也能接 API</p>
            <h2>界面很轻，能力可以是真实的。</h2>
          </div>

          <div className="api-grid">
            {apiCards.map((card) => (
              <article className="api-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
            <article className="api-card">
              <h3>当前 API 地址</h3>
              <code>{apiBase}</code>
              <p>通过 `VITE_API_BASE_URL` 注入，不把密钥写进前端。</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
