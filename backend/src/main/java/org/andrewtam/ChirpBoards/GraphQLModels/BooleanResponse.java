package org.andrewtam.ChirpBoards.GraphQLModels;

public class BooleanResponse {
    private String msg;
    private Boolean endRes;

    public BooleanResponse(String msg, Boolean endRes) {
        this.msg = msg;
        this.endRes = endRes;
    }

    public String getMsg() { return msg; }
    public Boolean getEndRes() { return endRes; }


}
