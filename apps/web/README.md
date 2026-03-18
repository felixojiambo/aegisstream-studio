@"
# AegisStream Studio

AI-native internal case operations platform for document processing, grounded Q&A, structured triage, human review, prompt governance, and workflow automation.

## Monorepo structure

- apps/web
- services/ai-service
- supabase
- evals
- docs

## Local development

### Web
cd apps/web
npm install
npm run dev

### AI service
cd services/ai-service
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
"@ | Set-Content README.md