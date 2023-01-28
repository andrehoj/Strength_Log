import { Link } from "react-router-dom";
import { Menu } from "@mantine/core";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function TemplateMenu({ template, handleTemplateDelete }) {
  const menuList = (
    <Menu.Dropdown
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <Link to={"/Edit-template"} state={{ template: template }}>
        <Menu.Item icon={<FaEdit size={14} />}>Edit</Menu.Item>
      </Link>

      <Menu.Item
        onClick={() => handleTemplateDelete(template._id)}
        icon={<FaTrash size={14} />}
      >
        Delete
      </Menu.Item>
    </Menu.Dropdown>
  );

  return (
    <Menu
      shadow="md"
      width={200}
      trigger="hover"
      closeDelay={200}
      transition="fade"
    >
      <Menu.Target>
        <button
          onClick={(event) => {
            event.stopPropagation();
          }}
          data-dropdown-toggle="dropdownDotsHorizontal"
          className="border inline-flex items-center py-1 px-2 text-sm font-medium text-center  rounded-lg"
          type="button"
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
          </svg>
        </button>
      </Menu.Target>

      {menuList}
    </Menu>

    /* <Menu placement="bottom-end" className="shadow-none">
      <MenuHandler
        
      >
      
      </MenuHandler>
      {menuList}
    </Menu> */
  );
}
