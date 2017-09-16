//TODO: В роут должна поступать инфа о том, кто юзер
class BaseRoute {
    constructor(core, req, res, params) {
        this.core = core;
        this.req = req;
        this.res = res;
        this.params = params;
        this.checkParamsAndHandle();
    }

    checkParamsAndHandle() {
        if (this.secretRequest && this.params.secret_key !== this.core.cfg.secret_key)
            return this.sendResponse(this.core.errors['BAD_PARAMS']('secret_key'), 400);

        if (!this.paramNames)
            return this.handle();

        for (let i = 0; i < this.paramNames.length; i++) {
            if (!this.params || !this.params[this.paramNames[i]]) {
                this.sendResponse(this.core.errors['BAD_PARAMS'](this.paramNames[i]), 400);
                return null;
            }
        }

        this.handle();
    }

    complete(res, err, message) {
        if (!res)
            return this.sendResponse({err, message}, 400);

        this.sendResponse(res, 200);
    }

    sendResponse(data, requestCode) {
        this.core.log.debug('Send request responce: ', JSON.stringify(data));
        this.res.setHeader('content-type', 'text/javascript');
        this.res.writeHead(requestCode);
        this.res.end(JSON.stringify(data));
    }
}

module.exports = BaseRoute;