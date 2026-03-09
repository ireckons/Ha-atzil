const axios = require('axios');

async function test() {
    try {
        const res = await axios.post('http://localhost:4000/api/products', {
            category_id: "1",
            name_he: "test",
            name_en: "test",
            description_he: "",
            description_en: "",
            price_nis: 0,
            unit: "kg",
            is_available: true,
            is_kosher: true,
            image_url: "https://storage.googleapis.com/test",
            weight_options: []
        }, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJnb29nbGUtYWRtaW4taW5mb0B3ZWJlZWxkLmNvbSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc3MzAwNTI0NywiZXhwIjoxNzczNjEwMDQ3fQ.E8JPrCS-mSIDIG_fHTCM80Cxb4u0rV5lxd7Q4PZ5pt8"
            }
        });
        console.log("SUCCESS:");
        console.log(res.data);
    } catch (err) {
        console.error("ERROR:");
        console.error(err.response?.data || err.message);
    }
}
test();
