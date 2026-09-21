# Qwen2.5-Coder 7B (Q4_K_M Quantization) — ExamPilot AI

This directory configures **Qwen2.5-Coder 7B (Q4_K_M)** as the primary local offline model for the **ExamPilot AI Examination Operating System**.

---

## 1. Specifications

| Attribute | Specification |
| :--- | :--- |
| **Model Name** | Qwen2.5-Coder-7B-Instruct |
| **Quantization** | `Q4_K_M` (4-bit medium quantization, GGUF format) |
| **Parameters** | 7.61 Billion |
| **Model Size** | 4.68 GB (4,683,074,048 bytes) |
| **Context Length** | 8,192 tokens (configurable up to 32k) |
| **Memory Footprint** | ~5.5 GB VRAM (GPU) or ~6.5 GB RAM (CPU) |
| **Default Port** | `http://127.0.0.1:11434` (Ollama standard API) |
| **Role in ExamPilot** | Offline AI Tutor, MCQ Generation Engine, Numerical Problem Verifier |

---

## 2. Why Qwen2.5-Coder 7B?

1. **State-of-the-art Code & Math**: Surpasses previous 7B/8B models in math, logical deduction, and structured JSON output.
2. **Deterministic Formatting**: Consistently follows JSON schemas for question factories, error diagnostic tagging, and step-by-step math proofs.
3. **100% Free & Private**: Zero API costs, zero data sent over external networks, works entirely offline without cloud dependencies.

---

## 3. Quickstart with Ollama

### Option A: Pull standard library model
```bash
ollama pull qwen2.5-coder:7b
```
*(In the official Ollama registry, `qwen2.5-coder:7b` defaults to the `Q4_K_M` quantization layer).*

### Option B: Build custom ExamPilot calibrated model
From this directory:
```bash
ollama create exampilot-qwen -f ./Modelfile
```

### Option C: Run interactive test
```bash
ollama run qwen2.5-coder:7b
```

---

## 4. Integration with ExamPilot

Set the environment variable in `.env`:
```env
VITE_AI_PROVIDER=auto
VITE_OLLAMA_BASE_URL=http://127.0.0.1:11434
VITE_OLLAMA_MODEL=qwen2.5-coder:7b
```

Or configure dynamically in the app via **AI Ingestion Studio** &rarr; **Local Ollama Settings**.
