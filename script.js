class ChatTree {

    constructor() {
    }

    async init(){
        const data = await this.reset();
        this.chat_tree = data;
        this.firstMsg = true;
        console.log("inside done");
        return "Chat has now been terminated. Send hi to begin chat again !";
    }

    async reset(){
        const response = await fetch('chat_tree.json');
        const jsonResponse = await response.json();
        return jsonResponse;
    }

    async getMessage(input){
        let resp = '';
        //input = new String(input.trim());
        //console.log(input);
        if(this.firstMsg===true) {
            this.firstMsg = false;
            resp += "Hey there buddy<br>";
        } else {

            if(("message" in this.chat_tree) && (input.trim()==="Reset")) {
                return this.init();
            }

            if(isNaN(parseInt(input)) || parseInt(input)<=0 || parseInt(input) > this.chat_tree['children'].length+1)
                return 'It seems like you gave a wrong input ! Go ahead try again !';

            if(parseInt(input)-1===this.chat_tree['children'].length){
                this.init();
            }

            this.chat_tree = this.chat_tree['children'][parseInt(input)-1];
        }

        if("message" in this.chat_tree){
            let data;
            if(this.chat_tree['type']==="function"){
                // console.log(String(this.chat_tree['message']),String("getJoke()"));
                if(this.chat_tree['message']==="getJoke()"){
                    data = await eval(this.chat_tree['message']);
                    data = data.value.joke;
                } else{
                    data = await eval(this.chat_tree['message']);
                    data = data.articles[0].title;
                }
            } else{
                data = this.chat_tree['message'];
            }
            resp += data;
            resp += "<br><br>Please input <b>Reset</b> to reset chat now";
        } else {
            for (let i in this.chat_tree['child_msg']) {
                resp += String(parseInt(i) + 1) + ". " + this.chat_tree['child_msg'][parseInt(i)] + "<br>";
            }
        }
        return resp;
    }
}

async function getJoke() {
    const response = await fetch('http://api.icndb.com/jokes/random');
    const jsonResp = await response.json();
    return jsonResp;
}

async function getNews() {
    const response = await fetch('http://newsapi.org/v2/top-headlines?country=in&pageSize=1&apiKey=a876816f98574cdfa23ffdc7d531c7bc');
    const jsonResp = await response.json();
    return jsonResp;
}