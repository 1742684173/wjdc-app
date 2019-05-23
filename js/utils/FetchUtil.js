class FetchUtil {

    init(){
        this.url           = '';
        this.method        = 'GET';
        this.headers       = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        this.body_type     = 'json';
        this.bodys         = {};
        this.credentials   = 'omit';
        this.return_type   = 'json';
        this.overtime      = 0;
        this.firstThen     = undefined;

        return this;
    }


    setUrl(url){
        this.url = url;
        return this;
    }

    setMethod(val){
        this.method = val;
        return this;
    }

    setBodyType(val){
        this.body_type = val;
        return this;
    }

    setReturnType(val){
        this.return_type = val;
        return this;
    }

    setOvertime(val){
        this.overtime = val;
        return this;
    }

    setHeader(name, val=null){
        if(typeof name == 'string'){
            this.headers[name] = val;
        }else if(typeof name == 'object'){
            Object.keys(name).map((index)=>{
                this.headers[index] = name[index];
            });
        }

        return this;
    }

    setBody(name, val=null){
        if(typeof name == 'string'){
            this.bodys[name] = val;
        }else if(typeof name == 'object'){
            Object.keys(name).map((index)=>{
                this.bodys[index] = name[index];
            });
        }
        return this;
    }

    setCookieOrigin(){
        this.credentials = 'same-origin';
        return this;
    }

    setCookieCors(){
        this.credentials = 'include';
        return this;
    }

    thenStart(then) {
        this.firstThen = then;
        return this;
    }

    dofetch = async () => {
        let options         = {};
        options.method      = this.method;
        options.credentials = this.credentials;

        options.headers = this.headers;

        if({} != this.bodys && this.method != 'GET'){
            if('form' == this.body_type){
                this.setHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
                let data = '';
                Object.keys(this.bodys).map((index) => {
                    let param = encodeURI(this.bodys[index]);
                    data += `${index}=${param}&`;
                });
                options.body = data;
            }else if('file' == this.body_type){
                let data = new FormData();
                Object.keys(this.bodys).map((index) => {
                    data.append(index, this.bodys[index]);
                });
                options.body = data;
            }else if('json' == this.body_type){
                options.body = JSON.stringify(this.bodys);
            }
        }

        return Promise.race([
            new Promise(async (resolve,reject)=>{
                try{
                    const data = await fetch(this.url,options);
                    resolve(data);
                }catch (e) {
                    console.log('请求异常：'+JSON.stringify(e));
                    reject('server error '+e);
                }
            }),
            new Promise((resolve, reject) => {
                //超时处理
                setTimeout(() => {
                    reject('request timeout');
                }, this.overtime ? this.overtime : 10 * 1000);
            })
        ])
            .then(
                (response) => {
                    if (this.firstThen) {
                        let tempResponse = this.firstThen(response);
                        if (tempResponse) {
                            return tempResponse;
                        }
                    }
                    return response;
                }
            ).then(
                (response) => {
                    if('json' == this.return_type){
                        return response.json();
                    }else if('text' == this.return_type){
                        return response.text();
                    }else if('blob' == this.return_type){
                        return response.blob();
                    }else if('formData' == this.return_type){
                        return response.formData();
                    }else if('arrayBuffer' == this.return_type){
                        return response.arrayBuffer();
                    }
                }).then(
                (error)=>{
                    return error;
                }
            );
    }

}

module.exports = FetchUtil;