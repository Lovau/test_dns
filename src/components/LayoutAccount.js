import { userService } from "services/users.service";
import { NavLink } from "components/NavLink";
import { WrapperForLoggedInOnlyPage } from "components/users/WrapperForLoggedInOnlyPage";

export { LayoutAccount };

function LayoutAccount({ children, sidebar, loggedin, register }) {
  var openTag;
  var closeTag;

  openTag = <WrapperForLoggedInOnlyPage>/* */ closeTag = </WrapperForLoggedInOnlyPage>;
  if (register) {
    openTag = "";
    closeTag = "";
  }

  return (
    <>
      {openTag}
      <div className="row">
        <div className={`col-md-${sidebar ? "8" : "12"}`}>{children}</div>
      </div>
      {closeTag}
    </>
  );
}
