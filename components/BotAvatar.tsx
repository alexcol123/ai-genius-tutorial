
import { Avatar, AvatarImage } from "./ui/avatar"
import { AvatarFallback } from "@radix-ui/react-avatar"


const UserAvatar = () => {

  return (
    <Avatar
      className="h-8 w-8  ">
      <AvatarImage  className="p-1" src="/logo.png"/>
     
    </Avatar>


  )
}

export default UserAvatar
