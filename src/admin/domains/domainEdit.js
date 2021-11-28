import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DomainAddEdit } from "admin/domains/DomainAddEdit";
import DomainDataService from "services/DomainService";
import { alertService } from "services/AlertService";
import { Alert } from "components/Alert";
import { RedirectIfNotLoggedIn } from "admin/RedirectIfNotLoggedIn";
import { Spinner } from "components/Spinner";

export default domainEdit;
function domainEdit() {
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const { domainid } = useParams();

  useEffect(() => {
    DomainDataService.get(domainid)
      .then((x) => {
        setLoading(false);
        if (!x.Item) {
          alertService.error("The domain has not been found.");
        } else {
          setDomain(x.Item);
        }
      })
      .catch(alertService.error);
  }, []);

  return (
    <>
      <RedirectIfNotLoggedIn />
      {loading ? <Spinner /> : ""}
      {domain ? <DomainAddEdit domain={domain} /> : <Alert />}
    </>
  );
}
