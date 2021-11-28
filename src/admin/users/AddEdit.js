import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link } from "react-router-dom";

import { userService } from "services/UserService";
import { alertService } from "services/AlertService";

export { AddEdit };

/**
 * The users AddEdit component is used for both adding and editing users, it contains a form built
 * with the React Hook Form library and is used by the add user page and edit user page.
 *
 * Form validation rules are defined with the Yup schema validation library and passed with the formOptions
 * to the React Hook Form useForm() function, for more info on Yup see https://github.com/jquense/yup.
 *
 * The useForm() hook function returns an object with methods for working with a form including registering inputs,
 * handling form submit, resetting the form, accessing form state, displaying errors and more,
 * for a complete list see https://react-hook-form.com/api/useform.
 *
 * The onSubmit function gets called when the form is submitted and valid, and either creates or updates a user
 * depending on which mode it is in.
 *
 * The form is in "add mode" when there is no user passed in the component props (props.user),
 * otherwise it is in "edit mode". The variable isAddMode is used to change the form behaviour based on the mode it is in,
 * for example in "add mode" the password field is required, and in "edit mode" (!isAddMode) the user details
 * are assigned to the form default values to pre-populate the form when it loads.
 *
 * The returned JSX template contains the form with all of the input fields and validation messages.
 * The form fields are registered with the React Hook Form by calling the register function with the field name
 * from each input element (e.g. {...register('firstName')}).
 */
function AddEdit(props) {
  const user = props?.user;
  const isAddMode = !user;

  // form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      .concat(isAddMode ? Yup.string().required("Password is required") : null)
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // set default form values if in edit mode
  if (!isAddMode) {
    console.log("coucou useredit", user, isAddMode);
    formOptions.defaultValues = props.user;
  }

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(data) {
    return isAddMode ? createUser(data) : updateUser(user.uuid, data);
  }

  function createUser(data) {
    return userService
      .register(data)
      .then(() => {
        alertService.success("User added", { keepAfterRouteChange: true });
        history.push(".");
      })
      .catch(alertService.error);
  }

  function updateUser(uuid, data) {
    return userService
      .update(uuid, data)
      .then(() => {
        alertService.success("User updated", { keepAfterRouteChange: true });
        history.push("..");
      })
      .catch(alertService.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="userform pt-3">
      <div className="form-row mb-3">
        <div className="col-4 offset-2">
          <label>First Name</label>
        </div>
        <div className="col-4">
          <input
            name="firstName"
            type="text"
            {...register("firstName")}
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
          />
        </div>
        <div className="offset-6 invalid-feedback">{errors.firstName?.message}</div>
      </div>
      <div className="form-row mb-3">
        <div className="col-4 offset-2">
          <label>Last Name</label>
        </div>
        <div className="col-4">
          <input
            name="lastName"
            type="text"
            {...register("lastName")}
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
          />
        </div>
        <div className="offset-6 invalid-feedback">{errors.lastName?.message}</div>
      </div>
      <div className="form-row mb-3">
        <div className="col-4 offset-2">
          <label>Username</label>
        </div>
        <div className="col-4">
          <input
            name="username"
            type="text"
            {...register("username")}
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
          />
        </div>
        <div className="offset-6 invalid-feedback">{errors.email?.message}</div>
      </div>
      <div className="form-row mb-3">
        <div className="col-4 offset-2">
          <label>
            Password{" "}
            {!isAddMode && <em className="ml-1">(Leave blank to keep the same password)</em>}
          </label>
        </div>
        <div className="col-4">
          <input
            name="password"
            type="password"
            {...register("password")}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
        </div>
        <div className="offset-6 invalid-feedback">{errors.password?.message}</div>
      </div>
      <div className="form-row mb-3">
        <div className="col-4 offset-2">
          <label>Confirm password</label>
        </div>
        <div className="col-4">
          <input
            name="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
          />
        </div>
        <div className="offset-6 invalid-feedback">{errors.confirmPassword?.message}</div>
      </div>
      <div className="form-row mb-3">
        <div className="col-4 offset-6">
          <Link to="/admin/users" className="btn btn-link">
            Cancel
          </Link>
          <button
            onClick={() => reset(formOptions.defaultValues)}
            type="button"
            disabled={formState.isSubmitting}
            className="btn btn-secondary mr-2"
          >
            Reset
          </button>
          <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
            {formState.isSubmitting && <span className="spinner-border spinner-border-sm"></span>}
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
