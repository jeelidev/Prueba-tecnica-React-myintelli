import * as React from "react"
import {
  LogOut,
  Search,
  Sparkles,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { NavMain } from "~/components/nav-main"
import { NavWorkspaces } from "~/components/nav-workspaces"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "~/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Listar Dispositivos",
      url: "list-devices",
      icon: Search,
    },
    {
      title: "Listar api externa",
      url: "list-api-externa",
      icon: Sparkles,
    },
    {
      title: "LogOut",
      url: "log-out",
      icon: LogOut,
    },
  ],
  modulos: [
    {
      name: "Personal Life Management",
      emoji: "🏠",
      pages: [
        {
          name: "Daily Journal & Reflection",
          url: "#",
          emoji: "📔",
        },
        {
          name: "Health & Wellness Tracker",
          url: "#",
          emoji: "🍏",
        },
        {
          name: "Personal Growth & Learning Goals",
          url: "#",
          emoji: "🌟",
        },
      ],
    },
    {
      name: "Professional Development",
      emoji: "💼",
      pages: [
        {
          name: "Career Objectives & Milestones",
          url: "#",
          emoji: "🎯",
        },
        {
          name: "Skill Acquisition & Training Log",
          url: "#",
          emoji: "🧠",
        },
        {
          name: "Networking Contacts & Events",
          url: "#",
          emoji: "🤝",
        },
      ],
    },
    {
      name: "Creative Projects",
      emoji: "🎨",
      pages: [
        {
          name: "Writing Ideas & Story Outlines",
          url: "#",
          emoji: "✍️",
        },
        {
          name: "Art & Design Portfolio",
          url: "#",
          emoji: "🖼️",
        },
        {
          name: "Music Composition & Practice Log",
          url: "#",
          emoji: "🎵",
        },
      ],
    },
    {
      name: "Home Management",
      emoji: "🏡",
      pages: [
        {
          name: "Household Budget & Expense Tracking",
          url: "#",
          emoji: "💰",
        },
        {
          name: "Home Maintenance Schedule & Tasks",
          url: "#",
          emoji: "🔧",
        },
        {
          name: "Family Calendar & Event Planning",
          url: "#",
          emoji: "📅",
        },
      ],
    },
    {
      name: "Travel & Adventure",
      emoji: "🧳",
      pages: [
        {
          name: "Trip Planning & Itineraries",
          url: "#",
          emoji: "🗺️",
        },
        {
          name: "Travel Bucket List & Inspiration",
          url: "#",
          emoji: "🌎",
        },
        {
          name: "Travel Journal & Photo Gallery",
          url: "#",
          emoji: "📸",
        },
      ],
    },
  ],
}
interface Page {
  name: string;
  url: string;
  emoji: React.ReactNode;  
};
interface modules  {
    name: string
    emoji: React.ReactNode
    pages: Page[]
  }

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar> & { fullName?:string,
  email?:string,
  modules?: any[]
}) {
  const [modulesDepurador, setModulesDepurador] = React.useState<modules[]>([])
  const getRandomEmoji = () => {
    
  const emojis = [
    "📸", "🌎", "🗺️", "🧳", "📅", "🔧", "💰", "🏡", "🎵", "🖼️", 
    "✍️", "🎨", "🤝", "🧠", "🎯", "💼", "🌟", "🍏", "📔", "🏠"
  ];
  const randomIndex = Math.floor(Math.random() * emojis.length);

  return emojis[randomIndex];
  }
  const objectToKeyValueArray = (dataObject:{[name:string]:any}) => {
  return Object.entries(dataObject).map(([key, value]) => `${key} - ${value}`);
}
  React.useEffect(() => {
    if (props.modules && props.modules?.length > 0) {
      let finalsModules = []
      finalsModules = props.modules.map((module) => {
      return {
        name: module.module as string,
        emoji: getRandomEmoji() as React.ReactNode,
        pages: objectToKeyValueArray(module.setting_module_config).map((page) => {
          return {
            name: page as string,
            url: "#",
            emoji: getRandomEmoji() as React.ReactNode,
          }
        })
      }
      }) 
      setModulesDepurador(finalsModules)
    }
  }, [ props.modules ])

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex gap-5 w-full px-4 pt-4" >
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="https://avatars.githubusercontent.com/u/229787899?v=4&size=64" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
          </div>
          <p className="flex flex-col gap-0.5 overflow-hidden">
            <span className="truncate font-medium">{props.fullName}</span>
            <span className="truncate font-light text-sm">{props.email}</span>
          </p>
        </div>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavWorkspaces modulos={modulesDepurador} />
      </SidebarContent>

    </Sidebar>
  )
}
