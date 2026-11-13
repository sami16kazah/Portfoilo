"use client";

import React, { useMemo, useState } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function AdminMuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ cache, flush }] = useState(() => {
    const emotionCache = createCache({ key: "mui" });
    emotionCache.compat = true;
    const prevInsert = emotionCache.insert;
    let inserted: string[] = [];

    emotionCache.insert = (...args) => {
      const serialized = args[1];
      if (emotionCache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flushNames = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache: emotionCache, flush: flushNames };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          primary: {
            main: "#10B981",
            light: "#34D399",
            dark: "#059669",
            contrastText: "#022C22",
          },
          secondary: {
            main: "#22D3EE",
            light: "#67E8F9",
            dark: "#0891B2",
            contrastText: "#083344",
          },
          error: {
            main: "#F43F5E",
          },
          warning: {
            main: "#FBBF24",
          },
          background: {
            default: "#070B14",
            paper: "#0D1322",
          },
          text: {
            primary: "#F8FAFC",
            secondary: "#94A3B8",
          },
          divider: "#1E293B",
        },
        shape: {
          borderRadius: 14,
        },
        typography: {
          fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                backgroundColor: "#0D1322",
                border: "1px solid #1E293B",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                backgroundColor: "#0D1322",
                border: "1px solid #1E293B",
                boxShadow: "0 12px 32px -12px rgba(0, 0, 0, 0.55)",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                backgroundColor: "#060A14",
                borderRadius: 12,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1E293B",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#334155",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#10B981",
                },
              },
            },
          },
          MuiTableContainer: {
            styleOverrides: {
              root: {
                backgroundColor: "#0D1322",
              },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                backgroundColor: "#080D1A",
                "& .MuiTableCell-root": {
                  color: "#94A3B8",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  borderBottomColor: "#1E293B",
                },
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottomColor: "#1E293B",
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: {
                "&:hover": {
                  backgroundColor: "rgba(30, 41, 59, 0.35)",
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 12,
              },
              containedPrimary: {
                backgroundColor: "#10B981",
                color: "#022C22",
                "&:hover": {
                  backgroundColor: "#34D399",
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                fontWeight: 600,
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                backgroundColor: "#0D1322",
                border: "1px solid #334155",
              },
            },
          },
        },
      }),
    []
  );

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
