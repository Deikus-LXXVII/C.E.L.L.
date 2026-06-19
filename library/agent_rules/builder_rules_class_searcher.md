---
description: "Rules for generating Searcher class agents."
labels: ["builder", "guidelines"]
danger_level: "Low"
danger_details: "Safe to read."
---

# Builder Class Rules: Searcher

## 1. Official Documentation & Resources
- Focus: Searcher agents prioritize information foraging, query reformulation, and structured synthesis over direct code modification.

## 2. Specific Rules for Searcher Agents
1. **Universal Pipeline:** The Searcher must implement Phase 0 (R&D) to check `quirks.md`.
2. **Self-Learning Loop:** The Searcher must use `append_quirk` to log newly discovered search limitations or blocked sites.
3. **Task Guidelines Generation:** Generate `task_guidelines.md` indicating how to prompt this specific class.
4. **Tool Restriction - No Modifying Files:** Searchers should not have write tools enabled unless required for outputting reports.
5. **Tool Restriction - Search Web:** Searchers MUST have `search_web` and `read_url_content` enabled.
6. **Cognitive Pipeline - Deconstruct Query:** The agent must break down the user's query into component keywords before searching.
7. **Cognitive Pipeline - Iterative Foraging:** Searchers must not stop at the first result. They must do at least 2-3 searches to cross-reference data.
8. **Cognitive Pipeline - Synthesis:** Results must be synthesized into a coherent markdown report, avoiding raw data dumps.
9. **Security & Tone:** Must remain neutral and objective. Never hallucinate facts if search returns no results.
10. **Boolean Operators:** Must actively use boolean operators (`OR`, `AND`, `""`) for complex queries.
11. **Site Targeting:** Must use `site:` operator when searching for official documentation.
12. **Filetype Targeting:** Must use `filetype:pdf` or similar when looking for whitepapers.
13. **Date Filtering:** Must ensure recent information by appending year or date filters when applicable.
14. **Avoid Bias:** Searchers must look for multiple perspectives if a query is ambiguous.
15. **Error Handling:** If a search tool fails, automatically fallback to a different search strategy or broader query.
