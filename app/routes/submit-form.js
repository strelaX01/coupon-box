import { json } from "@remix-run/node"; 

export const loader = async ({ request }) => {

    return json({ success: true });
};

export const action = async ({ request }) => {
    try {
        
        const formData = await request.json();
        console.log("Received Form Data:", formData);

        return json({ success: true });
    } catch (error) {
        console.error("Error processing form:", error);
        return json({ success: false, message: "Error processing form." }, { status: 500 });
    }
};

