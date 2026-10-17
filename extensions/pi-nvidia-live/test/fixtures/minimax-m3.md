---
title: "minimax-m3"
publisher: "minimaxai"
type: "endpoint"
updated: "2026-06-12T14:01:30.878Z"
description: "MiniMax M3 Preview is a multimodal MoE vision-language model with strong reasoning, coding, and tool-calling capabilities."
canonical: "https://build.nvidia.com/minimaxai/minimax-m3"
---

# MiniMax-M3

## Description
MiniMax-M3 is a multimodal vision-language model (VLM) built on a Mixture-of-Experts architecture for long-context reasoning, agentic workflows, and creative tasks. The model processes text, image, and video inputs and produces text outputs, with emphasis on long-form video understanding, long-horizon coding, and design and creative workflows.

*This model is ready for non-commercial use.*

## Third-Party Community Consideration:
This model is not owned or developed by NVIDIA. This model has been developed and built to a third-party's requirements for this application and use case; see link to Non-NVIDIA [MiniMax-M3 Model Card](https://huggingface.co/MiniMaxAI).

## License and Terms of Use:
**GOVERNING TERMS:** The trial service is governed by the [NVIDIA API Trial Terms of Service](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf); use of this model is governed by the [NVIDIA Software and Model Evaluation license](https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-software-and-model-evaluation-license/). ADDITIONAL INFORMATION: [Non-Commercial MiniMax License](https://github.com/MiniMax-AI/MiniMax-M2.7/blob/main/LICENSE). Copyright (c) 2026 MiniMax.

## Deployment Geography:
Global

## Use Case:
**Use Case:** MiniMax-M3 is intended for multimodal understanding across text, image, and video; long-form video understanding (up to 30 minutes); long-horizon coding tasks (8+ hours); agentic and tool-use workflows; and design and creative tasks.

## Release Date:
**Build.NVIDIA.com:** 06/07/2026 via [link](https://build.nvidia.com/minimaxai/minimax-m3) <br>
**Huggingface:** 06/07/2026 via [link](https://huggingface.co/MiniMaxAI)

## Reference(s):
- [MiniMax-M3 Model Card](https://huggingface.co/MiniMaxAI)

## Model Architecture:
**Architecture Type:** Transformer  
**Network Architecture:** Mixture-of-Experts (multimodal)  
**Total Parameters:** 428B  
**Active Parameters:** Approximately 22B per token (A22B)  
**Vision Encoder:** ViT for image and video input

### Input:
**Input Types:** Text, Image, Video  
**Input Formats:** String, Red, Green, Blue (RGB), Video frames  
**Input Parameters:** One-Dimensional (1D), Two-Dimensional (2D), Three-Dimensional (3D)  
**Other Input Properties:** Supports long-form video input up to 30 minutes.  
**Input Context Length (ISL):** 1 million tokens

### Output:
**Output Types:** Text  
**Output Format:** String  
**Output Parameters:** One-Dimensional (1D)  
**Other Output Properties:** None

__Our AI models are designed and/or optimized to run on NVIDIA GPU-accelerated systems. By leveraging NVIDIA's hardware (e.g. GPU cores) and software frameworks (e.g., CUDA libraries), the model achieves faster training and inference times compared to CPU-only solutions.__

## Software Integration:
**Runtime Engines:**
- **vLLM**
- **SGLang**

**Supported Hardware:**
- **NVIDIA Blackwell:** B200, B100, GB200
- **NVIDIA Hopper:** H100, H200

**Preferred Operating Systems:** Linux

__The integration of foundation and fine-tuned models into AI systems requires additional testing using use-case-specific data to ensure safe and effective deployment. Following the V-model methodology, iterative testing and validation at both unit and system levels are essential to mitigate risks, meet technical and functional requirements, and ensure compliance with safety and ethical standards before deployment.__

## Model Version(s)
MiniMax-M3 v1.0

## Training, Testing, and Evaluation Datasets:

### Training Dataset
**Data Modality:** Text, Image, Video  
**Image Training Data Size:** Undisclosed  
**Text Training Data Size:** Undisclosed  
**Training Data Collection:** Undisclosed  
**Training Labeling:** Undisclosed  
**Training Properties:** Undisclosed

### Testing Dataset
**Testing Data Collection:** Undisclosed  
**Testing Labeling:** Undisclosed  
**Testing Properties:** Undisclosed

### Evaluation Dataset
**Evaluation Benchmark Score:** Undisclosed  
**Evaluation Data Collection:** Undisclosed  
**Evaluation Labeling:** Undisclosed  
**Evaluation Properties:** Undisclosed

## Inference
**Acceleration Engine:** Dynamo + SGLang  
**Test Hardware:** NVIDIA GB200x4

## Ethical Considerations
NVIDIA believes Trustworthy AI is a shared responsibility and we have established policies and practices to enable development for a wide array of AI applications. Developers should work with their internal developer team to ensure these software components meet requirements for the relevant industry and use case and address unforeseen product misuse.

Please make sure you have proper rights and permissions for all input image and video content. Video and image inputs may capture identifiable people, voices, likenesses, biometric information, personal health information, or intellectual property; the model does not blur, redact, anonymize, or maintain the proportions of subjects included in the input, and long-form video input (up to 30 minutes) can contain incidental third-party subjects. Obtain consent where required and avoid submitting content you are not authorized to process.

Users are responsible for model inputs and outputs. Users are responsible for ensuring safe integration of this model, including implementing guardrails as well as other safety mechanisms, prior to deployment.

Please report model quality, risk, security vulnerabilities or NVIDIA AI Concerns [here](https://www.nvidia.com/en-us/support/submit-security-vulnerability/).

## Specifications

- **Context Length:** 1,048,576 tokens
- **Parameters:** 427,040,140,160
- **Input:** Text, Image, Video
- **Output:** Text

## Capabilities

- **Function Calling:** Supported
- **Structured Output:** Supported
- **Reasoning:** Supported

## Prototype

```python
import requests

invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
stream = False

headers = {
"Authorization": "Bearer $NVIDIA_API_KEY",
"Accept": "text/event-stream" if stream else "application/json",
}

payload = {
"messages": [
{
"role": "user",
"content": ""
}
]
}

response = requests.post(invoke_url, headers=headers, json=payload, stream=stream)
if stream:
for line in response.iter_lines():
if line:
print(line.decode("utf-8"))
else:
print(response.json())
```

```python
from langchain_nvidia_ai_endpoints import ChatNVIDIA

client = ChatNVIDIA(
model="",
api_key="$NVIDIA_API_KEY",
temperature=,
top_p=,
max_completion_tokens=,
)

lc_messages = [
{
"role": "user",
"content": "",
},
]

response = client.invoke(lc_messages)
if response.additional_kwargs and "reasoning_content" in response.additional_kwargs:
print(response.additional_kwargs["reasoning_content"])
print(response.content)
```

```javascript
import axios from 'axios';

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const stream = ;

const headers = {
"Authorization": "Bearer $NVIDIA_API_KEY",
"Accept": stream ? "text/event-stream" : "application/json"
};

async function main() {
const payload = {"messages":[{"role":"user","content":""}]};

const response = await axios.post(invokeUrl, payload, {
headers: headers,
responseType: stream ? 'stream' : 'json'
});

if (stream) {
response.data.on('data', (chunk) => {
console.log(chunk.toString());
});
} else {
console.log(JSON.stringify(response.data));
}
}

main().catch(error => {
if (error.response) {
console.error(`HTTP ${error.response.status}`);
if (error.response.data?.on) {
error.response.data.on('data', (chunk) => console.error(chunk.toString()));
} else {
console.error(error.response.data);
}
} else {
console.error(error);
}
});
```

```bash
stream=
if [ "$stream" = true ]; then
accept_header='Accept: text/event-stream'
else
accept_header='Accept: application/json'
fi

cat > payload.json <<JSON
{"messages":[{"role":"user","content":""}]}
JSON

curl https://integrate.api.nvidia.com/v1/chat/completions \
-H "Authorization: Bearer $NVIDIA_API_KEY" \
-H "Content-Type: application/json" \
-H "$accept_header" \
-d @payload.json
```