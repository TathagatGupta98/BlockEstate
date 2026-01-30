class ApiResponse{
    constructor(stutusCode,data,message="success"){
        this.stutusCode=stutusCode,
        this.data=data,
        this.message=message,
        this.success=stutusCode<400
    }
}
export{ApiResponse}