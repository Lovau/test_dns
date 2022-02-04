import { configureStore } from "@reduxjs/toolkit";
import DomainDynamicValueService from "services/reduxServices/DomainDynamicValueService";
import DomainFilterService from "services/reduxServices/DomainFilterService";
import DomainDynamicFilterService from "services/reduxServices/DomainDynamicFilterService";
import DomainUpdateService from "services/reduxServices/DomainUpdateService";

export default configureStore({
  reducer: {
    DomainDynamicValue: DomainDynamicValueService,
    DomainFilter: DomainFilterService,
    DomainDynamicFilter: DomainDynamicFilterService,
    DomainUpdate: DomainUpdateService,
  },
});
