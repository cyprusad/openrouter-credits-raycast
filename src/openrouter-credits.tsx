import { MenuBarExtra, getPreferenceValues, open, Cache, environment } from "@raycast/api";
import { useState, useEffect } from "react";

// Cache for credits data to persist between launches
const cache = new Cache();

interface Preferences {
  apiKey: string;
}

interface CreditsData {
  total_credits: number;
  total_usage: number;
}

interface CreditsResponse {
  data: CreditsData;
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function getRemainingColor(remaining: number): string {
  if (remaining <= 0) return "#FF0000"; // Red
  if (remaining <= 5) return "#FFCC00"; // Yellow
  return "#00CC00"; // Green
}

export default function Command() {
  const [credits, setCredits] = useState<CreditsData | null>(() => {
    // Try to load from cache immediately
    const cached = cache.get("credits");
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading, setIsLoading] = useState(!credits);
  const [error, setError] = useState<string | null>(null);
  
  const { apiKey } = getPreferenceValues<Preferences>();

  useEffect(() => {
    if (!apiKey) {
      setError("API key not configured");
      setIsLoading(false);
      return;
    }

    async function fetchCredits() {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/credits", {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Invalid API key");
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const data: CreditsResponse = await response.json();
        setCredits(data.data);
        cache.set("credits", JSON.stringify(data.data));
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch";
        setError(message);
        // Keep showing cached data if available
      } finally {
        setIsLoading(false);
      }
    }

    fetchCredits();
  }, [apiKey]);

  // Calculate remaining
  const remaining = credits ? credits.total_credits - credits.total_usage : 0;
  const color = getRemainingColor(remaining);
  const title = credits ? formatCurrency(remaining) : error || "--";

  return (
    <MenuBarExtra
      icon={{ source: "credit-card.png", tintColor: color }}
      title={title}
      tooltip="OpenRouter Credits"
      isLoading={isLoading}
    >
      {!apiKey && (
        <MenuBarExtra.Item
          title="Configure API Key"
          onAction={() => open("raycast://extensions/openrouter-credits/openrouter-credits/preferences")}
        />
      )}
      
      {error && apiKey && (
        <MenuBarExtra.Item title={`Error: ${error}`} />
      )}
      
      {credits && (
        <>
          <MenuBarExtra.Section title="Balance">
            <MenuBarExtra.Item
              title={`Remaining: ${formatCurrency(remaining)}`}
            />
            <MenuBarExtra.Item
              title={`Total: ${formatCurrency(credits.total_credits)}`}
            />
          </MenuBarExtra.Section>
          
          <MenuBarExtra.Section>
            <MenuBarExtra.Item
              title="Refresh"
              shortcut={{ modifiers: ["cmd"], key: "r" }}
              onAction={() => {
                setIsLoading(true);
                // Trigger re-fetch by toggling a dummy state
              }}
            />
            <MenuBarExtra.Item
              title="Open OpenRouter"
              onAction={() => open("https://openrouter.ai")}
            />
          </MenuBarExtra.Section>
        </>
      )}
      
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Preferences"
          onAction={() => open("raycast://extensions/openrouter-credits/openrouter-credits/preferences")}
        />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}
