import { useParams } from "react-router-dom";
import CreateBid from "./CreateBid";
import ProposalBids from "./ProposalBids";
import { useState } from "react";
import API from "../services/auth";

export default function BidPage() {
  const { proposalId } = useParams();

  // you probably already have companyId from auth context
  const companyId =async()=>{
    const res=await axios(`${API}/companies/:id`);
    return res.data;
  };

  const [refresh, setRefresh] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <CreateBid
        proposalId={proposalId}
        companyId={companyId}
        onSuccess={() => setRefresh(!refresh)}
      />

      <ProposalBids
        key={refresh}
        proposalId={proposalId}
      />

    </div>
  );
}
