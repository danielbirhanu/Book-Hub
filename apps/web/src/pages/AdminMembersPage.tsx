import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

type Member = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
};

export function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [message, setMessage] = useState("Loading members...");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const limit = 20;

  useEffect(() => {
    fetchMembers();
  }, [page, query]);
  
  function fetchMembers() {
    const offset = (page - 1) * limit;
    void fetch(`/api/v1/admin/members?offset=${offset}&limit=${limit}&q=${encodeURIComponent(query)}`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return (await response.json()) as Member[];
      })
      .then((items) => {
        setMembers(items);
        setMessage("");
      })
      .catch(() => setMessage("Unable to load members."));
  }

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Community</p>
          <h1>Members</h1>
          <p>View registered members and their status.</p>
        </div>
      </div>
      
      <section className="admin-panel catalog-records">
         <div className="panel-heading" style={{ marginBottom: "16px" }}>
            <h2>Community Members</h2>
            <div className="admin-search" style={{ margin: 0 }}>
               <Search size={16} />
               <input 
                  type="text" 
                  placeholder="Search by email..." 
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  style={{ border: "none", background: "transparent", outline: "none", width: "100%" }}
               />
            </div>
          </div>
          
          {message && <p style={{ color: "var(--muted)" }}>{message}</p>}

          <div className="catalog-list">
             {members.length === 0 && !message ? (
               <p style={{ color: "var(--muted)" }}>No members found.</p>
             ) : members.map((member) => (
              <article key={member.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3>{member.username}</h3>
                  <small>{member.email} · Joined {new Date(member.createdAt).toLocaleDateString()}</small>
                </div>
                <div>
                   {member.isAdmin ? (
                     <span className="status-badge" style={{ background: "var(--primary-dark)", color: "white" }}>Admin</span>
                   ) : (
                     <span className="status-badge">Member</span>
                   )}
                </div>
              </article>
            ))}
          </div>

          <div className="pagination-controls" style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
             <button 
                className="button button-secondary" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
             >
                <ChevronLeft size={16} /> Previous
             </button>
             <button 
                className="button button-secondary" 
                disabled={members.length < limit}
                onClick={() => setPage(p => p + 1)}
             >
                Next <ChevronRight size={16} />
             </button>
          </div>
      </section>
    </>
  );
}
