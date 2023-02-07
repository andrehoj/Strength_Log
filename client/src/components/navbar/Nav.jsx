import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Auth from "../../utils/auth/auth";
import { AiOutlineThunderbolt } from "react-icons/ai";
import LoginBtn from "../buttons/LoginBtn";
import SignupBtn from "../buttons/SignupBtn";
import TemplateNavBtn from "../buttons/TemplateNavBtn";
import ProgressNavBtn from "../buttons/ProgressNavBtn";
import LogoutBtn from "../buttons/LogoutBtn";
import { BsMoon, BsSun } from "react-icons/bs";
import {
  Drawer,
  Burger,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";

export function Nav() {
  const [openNav, setOpenNav] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  // close the hambuger menu if the screen width is to large
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navData = [
    {
      componentName: TemplateNavBtn,
      link: "/Templates",
      name: "Templates",
    },
    {
      componentName: ProgressNavBtn,
      link: "/Progress",
      name: "Progress",
    },
  ];

  const navItems = (
    <ul className="flex flex-col items-center item-center list-none p-5">
      <li>
        <AiOutlineThunderbolt size={90} />
      </li>

      <li className="my-10">
        {Auth.isLoggedIn() ? (
          <LogoutBtn setOpenNav={setOpenNav} openNav={openNav} />
        ) : (
          <div className="flex flex-col gap-1 items-center mt-2">
            <LoginBtn />
            <SignupBtn />
          </div>
        )}
      </li>

      {navData.map((item) => (
        <li className="mb-5" key={item.link}>
          <Link onClick={() => setOpenNav(false)} to={item.link}>
            <item.componentName />
          </Link>
        </li>
      ))}

      <li>
        {" "}
        <ActionIcon
          className="mt-5"
          variant="outline"
          color={dark ? "yellow" : "blue"}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {dark ? <BsSun size={18} /> : <BsMoon size={18} />}
        </ActionIcon>
      </li>
    </ul>
  );

  return (
    <>
      <nav
        className="hidden z-0 md:absolute md:block min-h-screen top-0 left-0 md:z-10"
        style={{ borderRight: "1px gray dotted" }}
      >
        {navItems}
      </nav>

      <div className="md:hidden">
        <Burger
          onClick={() => setOpenNav(!openNav)}
          opened={openNav}
          className="ml-5 mt-2"
        />

        <Drawer
          onClose={() => setOpenNav(false)}
          opened={openNav}
          transition="rotate-left"
          transitionDuration={250}
          transitionTimingFunction="ease"
          overlayOpacity={0.55}
          overlayBlur={3}
        >
          {navItems}
        </Drawer>
      </div>
    </>
  );
}
