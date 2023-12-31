import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  FormDialogProps,
  NotificationActionInterface,
  NotificationReducerInterface,
  SubmitConstructorParams,
} from "./types";
import {
  parseAPIErrors,
  produceDefaultNotificationStatus,
  restoreOriginalErrorState,
} from "./utils";

export const notificationReducer = function (
  state: NotificationReducerInterface,
  action: NotificationActionInterface
) {
  switch (action.type) {
    case "Add Comment":
      return Object.assign({}, state, {
        "Add Comment Notify": {
          message: state["Add Comment Notify"]["message"],
          status: true,
        },
      });
    case "Delete Comment":
      return Object.assign({}, state, {
        "Delete Comment Notify": {
          message: state["Delete Comment Notify"]["message"],
          status: true,
        },
      });
    case "Edit Comment":
      return Object.assign({}, state, {
        "Edit Comment Notify": {
          message: state["Edit Comment Notify"]["message"],
          status: true,
        },
      });
    case "Add Post":
      return Object.assign({}, state, {
        "Add Post Notify": {
          message: state["Add Post Notify"]["message"],
          status: true,
        },
      });
    case "Delete Post":
      return Object.assign({}, state, {
        "Delete Post Notify": {
          message: state["Delete Post Notify"]["message"],
          status: true,
        },
      });
    case "Edit Post":
      return Object.assign({}, state, {
        "Edit Post Notify": {
          message: state["Edit Post Notify"]["message"],
          status: true,
        },
      });
    case "Default":
      return Object.assign({}, state, produceDefaultNotificationStatus());
  }
};

export const redirectToOrigin = function () {
  return (window.location.href = `${window.location.origin}/whosaidwhatadmin/`);
};

export const settleErrors = async function (
  res: Response,
  setErrors: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, string | boolean>>>
  >
) {
  const response = await res.json().catch((err: Error) => {
    throw err;
  });

  const checkForErrors = function () {
    const errorsStatus = "errors" in response;
    return !errorsStatus;
  };

  const settleErrorFlow = function () {
    restoreOriginalErrorState(setErrors);
    const parsedErrors = parseAPIErrors(response);

    const mergeErrors = function (
      errors: Record<string, Record<string, string | boolean>>
    ) {
      return Object.assign({}, errors, parsedErrors);
    };

    setErrors(mergeErrors);
  };

  return checkForErrors() || settleErrorFlow();
};

export const produceCommentFormProps = function () {
  const addCommentProps = function (
    post: string,
    user: string
  ): FormDialogProps {
    const button = function (clickHandler: () => void) {
      return (
        <>
          <Button
            size="small"
            variant="contained"
            endIcon={<AddCircleIcon />}
            sx={{ display: { xs: "inline-flex", sm: "none" } }}
            onClick={clickHandler}
          >
            Add
          </Button>
          <Button
            size="small"
            variant="contained"
            endIcon={<AddCircleIcon />}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
            onClick={clickHandler}
          >
            Add Comment
          </Button>
        </>
      );
    };

    const inputLabel = "Add Comment";
    const inputText = "Have your own say on this post.";

    const handleSubmitConstructor = function (params: SubmitConstructorParams) {
      const { resetIndexData, resetLoadingState, setErrors, setNotifications } =
        params;

      const notifyAddCommentSuccess = function () {
        setNotifications
          ? setNotifications({ type: "Add Comment" })
          : console.error("setNotficiations is null");
      };

      const addCommentReload = function () {
        resetLoadingState
          ? resetLoadingState()
          : console.error("resetLoadingState is null");
      };

      const addCommentFetcher = async function (data: string) {
        const response = await fetch("https://wswapi.onrender.com/comment", {
          body: data,
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Origin: `${window.location.origin}`,
          },
          method: "POST",
          mode: "cors",
          redirect: "follow",
          referrer: window.location.href,
        }).catch((err: Error) => {
          throw err;
        });
        const errorStatus = await settleErrors(response, setErrors).catch(
          (err: Error) => {
            throw err;
          }
        );
        return (
          errorStatus &&
          [resetIndexData, addCommentReload, notifyAddCommentSuccess].map(
            (action) => action()
          )
        );
      };

      const handleSubmit = async function (
        event: React.FormEvent<HTMLFormElement>
      ) {
        event.preventDefault();
        const rawData = new FormData(event.currentTarget);
        rawData.append("post", post);
        rawData.append("user", user);
        const data = JSON.stringify(Object.fromEntries(rawData.entries()));
        await addCommentFetcher(data).catch((err: Error) => {
          console.error(err);
        });
      };

      return handleSubmit;
    };

    return {
      button,
      delete: false,
      handleSubmitConstructor,
      inputLabel,
      inputText,
    };
  };

  const deleteCommentProps = function (id: string, userId: string) {
    const button = function (clickHandler: () => void) {
      return (
        <Button
          size="small"
          variant="text"
          startIcon={<DeleteIcon />}
          sx={{ mr: "auto" }}
          onClick={clickHandler}
        >
          Delete comment
        </Button>
      );
    };

    const inputLabel = "Delete Comment";
    const inputText =
      "Be absolutely sure you want to delete this comment. Once deleted, it shall be impossible to retrieve.";
    const submitLabel = "Delete";

    const handleSubmitConstructor = function (params: SubmitConstructorParams) {
      const { resetIndexData, resetLoadingState, setErrors, setNotifications } =
        params;

      const notifyDeleteCommentSuccess = function () {
        setNotifications
          ? setNotifications({ type: "Delete Comment" })
          : console.error("setNotficiations is null");
      };

      const deleteCommentReload = function () {
        resetLoadingState
          ? resetLoadingState()
          : console.error("resetLoadingState is null");
      };

      const deleteCommentFetcher = async function (data: string) {
        const response = await fetch("https://wswapi.onrender.com/comment", {
          body: data,
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Origin: `${window.location.origin}`,
          },
          method: "DELETE",
          mode: "cors",
          redirect: "follow",
          referrer: window.location.href,
        }).catch((err: Error) => {
          throw err;
        });
        const errorStatus = await settleErrors(response, setErrors).catch(
          (err: Error) => {
            throw err;
          }
        );
        return (
          errorStatus &&
          [resetIndexData, deleteCommentReload, notifyDeleteCommentSuccess].map(
            (action) => action()
          )
        );
      };

      const handleSubmit = async function (
        event: React.FormEvent<HTMLFormElement>
      ) {
        event.preventDefault();
        const _id = id;
        const rawData = new FormData();
        rawData.append("_id", _id);
        rawData.append("user", userId);
        const data = JSON.stringify(Object.fromEntries(rawData.entries()));
        await deleteCommentFetcher(data).catch((err: Error) => {
          console.error(err);
        });
        return;
      };

      return handleSubmit;
    };

    return {
      button,
      delete: true,
      handleSubmitConstructor,
      inputLabel,
      inputText,
      submitLabel,
    };
  };

  const editCommentProps = function (
    modifyingKeys: Record<"id" | "content" | "post" | "userId", string>
  ) {
    const { content, id, post, userId } = modifyingKeys;

    const button = function (clickHandler: () => void) {
      return (
        <Button
          size="small"
          variant="text"
          startIcon={<EditIcon />}
          sx={{ mr: "auto" }}
          onClick={clickHandler}
        >
          Edit comment
        </Button>
      );
    };

    const inputLabel = "Edit Comment";
    const inputText = "Edit your comment in the field below.";

    const handleSubmitConstructor = function (params: SubmitConstructorParams) {
      const { resetIndexData, resetLoadingState, setErrors, setNotifications } =
        params;

      const notifyEditCommentSuccess = function () {
        setNotifications
          ? setNotifications({ type: "Edit Comment" })
          : console.error("setNotficiations is null");
      };

      const editCommentReload = function () {
        resetLoadingState
          ? resetLoadingState()
          : console.error("resetLoadingState is null");
      };

      const editCommentFetcher = async function (data: string) {
        const response = await fetch("https://wswapi.onrender.com/comment", {
          body: data,
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Origin: `${window.location.origin}`,
          },
          method: "PUT",
          mode: "cors",
          redirect: "follow",
          referrer: window.location.href,
        }).catch((err: Error) => {
          throw err;
        });
        const errorStatus = await settleErrors(response, setErrors).catch(
          (err: Error) => {
            throw err;
          }
        );
        return (
          errorStatus &&
          [resetIndexData, editCommentReload, notifyEditCommentSuccess].map(
            (action) => action()
          )
        );
      };

      const handleSubmit = async function (
        event: React.FormEvent<HTMLFormElement>
      ) {
        event.preventDefault();
        const rawData = new FormData(event.currentTarget);
        const _id = id;
        rawData.append("_id", _id);
        rawData.append("post", post);
        rawData.append("user", userId);
        const data = JSON.stringify(Object.fromEntries(rawData.entries()));
        await editCommentFetcher(data).catch((err: Error) => {
          console.error(err);
        });
      };

      return handleSubmit;
    };

    return {
      button,
      content,
      delete: false,
      handleSubmitConstructor,
      inputLabel,
      inputText,
    };
  };

  return {
    addCommentProps,
    deleteCommentProps,
    editCommentProps,
  };
};

export const producePostFormProps = function () {
  const addPostProps = function (user: string): FormDialogProps {
    const button = function (clickHandler: () => void) {
      return (
        <>
          <Button
            size="small"
            variant="contained"
            endIcon={<AddCircleIcon />}
            sx={{ display: { xs: "inline-flex", sm: "none" } }}
            onClick={clickHandler}
          >
            Add
          </Button>
          <Button
            size="small"
            variant="contained"
            endIcon={<AddCircleIcon />}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
            onClick={clickHandler}
          >
            Add Post
          </Button>
        </>
      );
    };

    const inputLabel = "Add Post";
    const inputText = "Create new post.";
    const titleLabel = "Add the title of your post";

    const handleSubmitConstructor = function (params: SubmitConstructorParams) {
      const { resetIndexData, resetLoadingState, setErrors, setNotifications } =
        params;

      const notifyAddPostSuccess = function () {
        setNotifications
          ? setNotifications({ type: "Add Post" })
          : console.error("setNotficiations is null");
      };

      const addPostReload = function () {
        resetLoadingState
          ? resetLoadingState()
          : console.error("resetLoadingState is null");
      };

      const addPostFetcher = async function (data: string) {
        const response = await fetch("https://wswapi.onrender.com/post", {
          body: data,
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Origin: `${window.location.origin}`,
          },
          method: "POST",
          mode: "cors",
          redirect: "follow",
          referrer: window.location.href,
        }).catch((err: Error) => {
          throw err;
        });
        const errorStatus = await settleErrors(response, setErrors).catch(
          (err: Error) => {
            throw err;
          }
        );
        return (
          errorStatus &&
          [resetIndexData, addPostReload, notifyAddPostSuccess].map((action) =>
            action()
          )
        );
      };

      const handleSubmit = async function (
        event: React.FormEvent<HTMLFormElement>
      ) {
        event.preventDefault();
        const rawData = new FormData(event.currentTarget);
        rawData.append("user", user);
        const data = JSON.stringify(Object.fromEntries(rawData.entries()));
        await addPostFetcher(data).catch((err: Error) => {
          console.error(err);
        });
      };

      return handleSubmit;
    };

    return {
      button,
      delete: false,
      handleSubmitConstructor,
      inputLabel,
      inputText,
      titleLabel,
    };
  };

  const deletePostProps = function (id: string, userId: string) {
    const button = function (clickHandler: () => void) {
      return (
        <Button
          size="small"
          variant="text"
          startIcon={<DeleteIcon />}
          sx={{ mr: "auto" }}
          onClick={clickHandler}
        >
          Delete post
        </Button>
      );
    };

    const inputLabel = "Delete Post";
    const inputText =
      "Be absolutely sure you want to delete this post. Once deleted, it shall be impossible to retrieve.";
    const submitLabel = "Delete";

    const handleSubmitConstructor = function (params: SubmitConstructorParams) {
      const { resetIndexData, resetLoadingState, setErrors, setNotifications } =
        params;

      const notifyDeletePostSuccess = function () {
        setNotifications
          ? setNotifications({ type: "Delete Post" })
          : console.error("setNotficiations is null");
      };

      const deletePostReload = function () {
        resetLoadingState
          ? resetLoadingState()
          : console.error("resetLoadingState is null");
      };

      const deleteCommentFetcher = async function (data: string) {
        const response = await fetch("https://wswapi.onrender.com/post", {
          body: data,
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Origin: `${window.location.origin}`,
          },
          method: "DELETE",
          mode: "cors",
          redirect: "follow",
          referrer: window.location.href,
        }).catch((err: Error) => {
          throw err;
        });
        const errorStatus = await settleErrors(response, setErrors).catch(
          (err: Error) => {
            throw err;
          }
        );
        return (
          errorStatus &&
          [resetIndexData, deletePostReload, notifyDeletePostSuccess].map(
            (action) => action()
          )
        );
      };

      const handleSubmit = async function (
        event: React.FormEvent<HTMLFormElement>
      ) {
        event.preventDefault();
        const _id = id;
        const rawData = new FormData();
        rawData.append("_id", _id);
        rawData.append("user", userId);
        const data = JSON.stringify(Object.fromEntries(rawData.entries()));
        await deleteCommentFetcher(data).catch((err: Error) => {
          console.error(err);
        });
        return;
      };

      return handleSubmit;
    };

    return {
      button,
      delete: true,
      handleSubmitConstructor,
      inputLabel,
      inputText,
      submitLabel,
    };
  };

  const editPostProps = function (
    modifyingKeys: Record<"id" | "content" | "title" | "userId", string>
  ) {
    const { content, id, title, userId } = modifyingKeys;

    const button = function (clickHandler: () => void) {
      return (
        <Button
          size="small"
          variant="text"
          startIcon={<EditIcon />}
          sx={{ mr: "auto" }}
          onClick={clickHandler}
        >
          Edit post
        </Button>
      );
    };

    const inputLabel = "Edit Post";
    const inputText = "Edit the content of your post in the field below.";
    const titleLabel = "Edit this Post's title";

    const handleSubmitConstructor = function (params: SubmitConstructorParams) {
      const { resetIndexData, resetLoadingState, setErrors, setNotifications } =
        params;

      const notifyEditPostSuccess = function () {
        setNotifications
          ? setNotifications({ type: "Edit Post" })
          : console.error("setNotficiations is null");
      };

      const editPostReload = function () {
        resetLoadingState
          ? resetLoadingState()
          : console.error("resetLoadingState is null");
      };

      const editCommentFetcher = async function (data: string) {
        const response = await fetch("https://wswapi.onrender.com/post", {
          body: data,
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Origin: `${window.location.origin}`,
          },
          method: "PUT",
          mode: "cors",
          redirect: "follow",
          referrer: window.location.href,
        }).catch((err: Error) => {
          throw err;
        });
        const errorStatus = await settleErrors(response, setErrors).catch(
          (err: Error) => {
            throw err;
          }
        );
        return (
          errorStatus &&
          [resetIndexData, editPostReload, notifyEditPostSuccess].map(
            (action) => action()
          )
        );
      };

      const handleSubmit = async function (
        event: React.FormEvent<HTMLFormElement>
      ) {
        event.preventDefault();
        const rawData = new FormData(event.currentTarget);
        const _id = id;
        rawData.append("_id", _id);
        rawData.append("user", userId);
        const data = JSON.stringify(Object.fromEntries(rawData.entries()));
        await editCommentFetcher(data).catch((err: Error) => {
          console.error(err);
        });
      };

      return handleSubmit;
    };

    return {
      button,
      content,
      delete: false,
      handleSubmitConstructor,
      inputLabel,
      inputText,
      title,
      titleLabel,
    };
  };

  return {
    addPostProps,
    deletePostProps,
    editPostProps,
  };
};
