import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
  } from "@radix-ui/react-menubar"
  
function MenubarDemo() {
    return (
      <Menubar>
        <MenubarMenu>
          Logo
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Home</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
            <MenubarTrigger>Solver</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
            General 
            </MenubarItem>
            <MenubarItem>
            GLPK 
            </MenubarItem>
            <MenubarItem>
            Highs 
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>About</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )
  }

  export { MenubarDemo }
  