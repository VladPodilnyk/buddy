import { FC, useState } from "react";

interface UsernamePickerProps {
  onSave: (value: string | null) => void;
}

export const UsernamePicker: FC<UsernamePickerProps> = (props) => {
  const [isEditing, setIsEditing] = useState(true);
  const [displayValue, setDisplayValue] = useState("");

  const onUsernameInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDisplayValue(event.target.value);
  };

  const onClick = () => {
    if (isEditing) {
      props.onSave(displayValue || null);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="user-picker">
      <p>Enter your username: </p>
      <input
        size={10}
        name="username-input"
        value={displayValue}
        onChange={onUsernameInputChange}
        disabled={!isEditing}
      />
      <button onClick={onClick}>{isEditing ? "Save" : "Edit"}</button>
    </div>
  );
};
