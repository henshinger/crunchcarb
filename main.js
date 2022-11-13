document.addEventListener('alpine:init', () => {
    Alpine.store('text', {
        input_text: '',
        output_text: 'Your Output will show up here',

        async summarize(action="summarize") {
            const rawResponse = await fetch('https://asia-southeast1-carbcrunch.cloudfunctions.net/summarize', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "text": this.input_text,
                    "action": action
                })
            });
            const content = await rawResponse.json();
            console.log(content);
            this.output_text = content["summary"];
        }
    })
    Alpine.data('text_input', () => ({
        rephrase_open: false,
        create_open: false,
        rephrase_options: [
            {"id": "rephrase_public", "text": "General Public"},
            {"id": "rephrase_business", "text": "Business Leaders"},
            {"id": "rephrase_policymakers", "text": "Policy Makers"}
        ],
        create_options: [
            {"id": "create_email", "text": "Email"},
            {"id": "create_policy", "text": "Policy"},
            {"id": "create_press_release", "text": "Press Release"},
            {"id": "create_petition", "text": "Petition"},
            {"id": "create_tweet", "text": "Tweet"},
        ],

        rephrase_dropdown: {
            ['@click']() {
                this.rephrase_open = !this.rephrase_open;
            },
            ['@click.outside']() {
                this.rephrase_open = false;
            }
        },
        create_dropdown: {
            ['@click']() {
                this.create_open = !this.create_open;
            },
            ['@click.outside']() {
                this.create_open = false;
            }
        },
    }));
    console.log("main.js loaded")
})

// const summarize = async (text) => {
//         const rawResponse = await fetch('https://asia-southeast1-carbcrunch.cloudfunctions.net/summarize', {
//           method: 'POST',
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             "text": "I loved your pie",
//             "action": "create_email"
//           })
//         });
//         const content = await rawResponse.json();
      
//         console.log(content);
//     }