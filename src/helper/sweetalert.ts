import Swal from "sweetalert2";

export const errorAlert = ({
  title,
  text,
}: {
  title: string;
  text?: string;
}) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
  });
};
