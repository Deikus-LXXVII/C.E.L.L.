# Task Guidelines: web-searcher

This document outlines how an orchestrator (Main Agent) should prompt the `web-searcher` subagent for optimal results.

## 1. Provide Context
Never send isolated keywords. Always explain *why* the information is needed.
- **Bad:** "Find documentation on Exa API."
- **Good:** "We are evaluating AI-native search APIs. Find documentation on the Exa API, specifically focusing on its neural search capabilities and pricing."

## 2. Define Boundaries
If you only want official sources, state it clearly.
- "Restrict your search to official .edu domains or official corporate documentation."
- "Look only for resources published after 2024."

## 3. Specify Output Format
Tell the searcher how you want the data structured.
- "Return the findings as a comparison table."
- "Provide a citation-ready summary in Markdown."

## 4. Encourage Iteration
Explicitly permit the searcher to try multiple angles.
- "If you don't find it under 'API', try searching for 'SDK' or 'integration'."

## 5. Domain: advanced_search
This agent uses hybrid logic. Do not formulate the boolean queries yourself; just provide clear requirements and let the agent construct the `site:`, `""`, and `OR` logic.
