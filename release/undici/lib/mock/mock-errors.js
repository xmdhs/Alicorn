"use strict";const{UndiciError}=require("../core/errors");class MockNotMatchedError extends UndiciError{constructor(r){super(r),Error.captureStackTrace(this,MockNotMatchedError),this.name="MockNotMatchedError",this.message=r||"The request does not match any registered mock dispatches",this.code="UND_MOCK_ERR_MOCK_NOT_MATCHED"}}module.exports={MockNotMatchedError};