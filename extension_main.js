document.addEventListener('alpine:init', () => {
    
    var param = window.location.hash.substr(1);
    if (param.length == 0)
        param = ''
    Alpine.store('text', {
        input_text: decodeURI(param),
        output_text: '',
        news_feed:  news_feed,
        policy_feed: policy_feed,
        is_news_feed_visible: true,
        is_loading: false, 
        email_link_visible: false,
        tweet_link_visible: false,
        email_link: "mailto:first.lady@whitehouse.gov?body=I%5Bm%20loving%20CruchCarb!",
        tweet_link: "https://twitter.com/intent/tweet?text=I%5Bm%20loving%20CruchCarb!" ,

        set_input_text(text) {
            this.input_text = text
        },

        async summarize(action="summarize") {
            this.is_loading = true;
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
            this.output_text = content["summary"].trim();
            this.is_loading = false;
            if ((action === "create_email") || (action === "create_petition")) {
                this.email_link_visible = true;
                this.email_link = `mailto:first.lady@whitehouse.gov?body=${encodeURIComponent(this.output_text)}`;   
            } else {
                this.email_link_visible = false;
            }

            if (action === "create_tweet") {
                this.tweet_link_visible = true;
                this.tweet_link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.output_text.slice(0,280))}`;   
            } else {
                this.tweet_link_visible = false;
            }

        },
        copy_output() {
            var input = document.createElement('textarea');
            input.innerHTML = this.output_text;
            document.body.appendChild(input);
            input.select();
            var result = document.execCommand('copy');
            document.body.removeChild(input);
            return result;
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
