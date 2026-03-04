const API_KEY = "sk-pZQtTyQnsnHHQ2ZRQb04ZN3ac7nAF";

async function test() {
    console.log("Submitting...");
    const res = await fetch("https://api.apifree.ai/v1/image/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "bytedance/seedream-4.5",
            prompt: "a beautiful white sand beach"
        })
    });
    const data = await res.json();
    console.log("Submit:", data);
    const id = data.resp_data.request_id;
    console.log("ID:", id);

    const paths = [
        `/v1/image/${id}/result`,
        `/v1/image/result/${id}`,
        `/v1/image/status/${id}`,
        `/v1/image/${id}/status`,
        `/v1/image/task/${id}`,
        `/v1/image/${id}`,
        `/api/v1/image/${id}/result`,
        `/v1/images/generations/${id}`
    ];

    for (const path of paths) {
        const url = `https://api.apifree.ai${path}`;
        const res = await fetch(url, { headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" } });
        console.log(`GET ${path} -> ${res.status}`);
    }
}

test();
