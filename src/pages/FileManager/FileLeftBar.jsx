import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import axios from "axios";

const FileLeftBar = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/historique", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setHistory(res.data))
    .catch(err => console.error("Erreur chargement historique", err));
  }, []);

  // return (
  //   <div>
  //     <h5 className="font-size-16 mb-3">Connexions récentes</h5>
  //     <div className="table-responsive">
  //       <Table className="table table-sm table-hover">
  //         <thead>
  //           <tr>
  //             <th>Login</th>
  //             <th>Date</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {history.map((entry, idx) => (
  //             <tr key={idx}>
  //               <td>{entry.login}</td>
  //               <td>{new Date(entry.dateConnexion).toLocaleString()}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </Table>
  //     </div>
  //   </div>
  // );
};

export default FileLeftBar;
