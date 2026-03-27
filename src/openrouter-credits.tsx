// @ts-nocheck
import { MenuBarExtra, getPreferenceValues, open } from "@raycast/api";
import { useState, useEffect, useCallback } from "react";

const CACHE_KEY = "openrouter_credits";

function getCachedCredits() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedCredits(data: any) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore
  }
}

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
  if (remaining <= 0) return "#FF0000";
  if (remaining <= 5) return "#FFCC00";
  return "#00CC00";
}

export default function Command() {
  const [credits, setCredits] = useState<CreditsData | null>(getCachedCredits);
  const [isLoading, setIsLoading] = useState(!credits);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { apiKey } = getPreferenceValues<Preferences>();

  const fetchCredits = useCallback(async () => {
    if (!apiKey) {
      setError("API key not configured");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/credits", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid API key");
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data: CreditsResponse = await response.json();
      setCredits(data.data);
      setCachedCredits(data.data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits, refreshTrigger]);

  useEffect(() => {
    if (!apiKey) return;

    const interval = setInterval(
      () => {
        setRefreshTrigger((prev) => prev + 1);
      },
      15 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [apiKey]);

  const remaining = credits ? credits.total_credits - credits.total_usage : 0;
  const color = getRemainingColor(remaining);
  const title = credits ? formatCurrency(remaining) : error || "--";

  return (
    <MenuBarExtra
      icon={{ source: "💳" }}
      title={title}
      tooltip="OpenRouter Credits"
      isLoading={isLoading}
    >
      {error ? (
        <MenuBarExtra.Item title={`Error: ${error}`} />
      ) : credits ? (
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
                setRefreshTrigger((prev) => prev + 1);
              }}
            />
            <MenuBarExtra.Item
              title="Open OpenRouter"
              onAction={() => open("https://openrouter.ai")}
            />
          </MenuBarExtra.Section>
        </>
      ) : null}

      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Preferences"
          onAction={() =>
            open("raycast://extensions/openrouter-credits/preferences")
          }
        />
        <MenuBarExtra.Item
          title="View Source Code"
          onAction={() => open("https://github.com/cyprusad/openrouter-widget")}
        />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}
