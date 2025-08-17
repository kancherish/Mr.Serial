export interface navbarItems {
  name:string;
  cb:()=>void;
}

export interface fetchedPorts {
    path:string;
    name:string;
}

export interface modulesObj {
    name:string;
    type:string;
    status:string;
}
