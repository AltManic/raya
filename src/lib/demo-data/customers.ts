export type CustomerPlan = "Starter" | "Growth" | "Scale" | "Enterprise"
export type CustomerStatus = "active" | "trialing" | "past_due" | "churned"

export interface Customer {
  id: string
  company: string
  owner: string
  plan: CustomerPlan
  status: CustomerStatus
  mrr: number
}

export const customers: Customer[] = [
  { id: "SHP-1041", company: "Northwind Labs", owner: "Priya Raman", plan: "Scale", status: "active", mrr: 1240 },
  { id: "SHP-1042", company: "Acme Foundry", owner: "Jonas Weber", plan: "Growth", status: "trialing", mrr: 420 },
  { id: "SHP-1043", company: "Bluepeak Systems", owner: "Mara Ellison", plan: "Starter", status: "active", mrr: 99 },
  { id: "SHP-1044", company: "Cobalt & Sons", owner: "Theo Marchetti", plan: "Scale", status: "past_due", mrr: 1240 },
  { id: "SHP-1045", company: "Driftwood AI", owner: "Ines Okafor", plan: "Growth", status: "active", mrr: 460 },
  { id: "SHP-1046", company: "Emberline Studio", owner: "Ravi Chandra", plan: "Starter", status: "active", mrr: 99 },
  { id: "SHP-1047", company: "Foxglove Health", owner: "Lena Brandt", plan: "Enterprise", status: "active", mrr: 3800 },
  { id: "SHP-1048", company: "Granite Peak Outdoors", owner: "Cole Danner", plan: "Starter", status: "churned", mrr: 0 },
  { id: "SHP-1049", company: "Harborview Logistics", owner: "Yuki Tanaka", plan: "Growth", status: "active", mrr: 540 },
  { id: "SHP-1050", company: "Ironbark Legal", owner: "Charlotte Ngata", plan: "Scale", status: "active", mrr: 1180 },
  { id: "SHP-1051", company: "Juniper & Vine", owner: "Marco Bellini", plan: "Starter", status: "trialing", mrr: 99 },
  { id: "SHP-1052", company: "Kestrel Analytics", owner: "Dana Whitfield", plan: "Growth", status: "active", mrr: 610 },
  { id: "SHP-1053", company: "Lumen Robotics", owner: "Andrei Popescu", plan: "Enterprise", status: "active", mrr: 4200 },
  { id: "SHP-1054", company: "Mistral Freight", owner: "Sofia Duarte", plan: "Growth", status: "past_due", mrr: 480 },
  { id: "SHP-1055", company: "Nimbus Weather Co", owner: "Owen Gallagher", plan: "Starter", status: "active", mrr: 129 },
  { id: "SHP-1056", company: "Orchard Labs", owner: "Grace Lim", plan: "Scale", status: "active", mrr: 1320 },
  { id: "SHP-1057", company: "Pinecrest Education", owner: "Samuel Adeyemi", plan: "Growth", status: "active", mrr: 520 },
  { id: "SHP-1058", company: "Quarry Digital", owner: "Nadia Petrova", plan: "Starter", status: "churned", mrr: 0 },
  { id: "SHP-1059", company: "Redwood Systems", owner: "Ethan Caldwell", plan: "Enterprise", status: "active", mrr: 3950 },
  { id: "SHP-1060", company: "Solstice Energy", owner: "Amara Diallo", plan: "Scale", status: "active", mrr: 1450 },
  { id: "SHP-1061", company: "Tidalworks Marine", owner: "Liam Ó Súilleabháin", plan: "Growth", status: "trialing", mrr: 540 },
  { id: "SHP-1062", company: "Umbra Security", owner: "Viktor Hansen", plan: "Scale", status: "active", mrr: 1275 },
  { id: "SHP-1063", company: "Verdant Farms", owner: "Camila Reyes", plan: "Starter", status: "active", mrr: 99 },
  { id: "SHP-1064", company: "Willow & Wren", owner: "Freya Lindqvist", plan: "Starter", status: "past_due", mrr: 89 },
  { id: "SHP-1065", company: "Xenon Optics", owner: "Hiro Yamamoto", plan: "Growth", status: "active", mrr: 585 },
  { id: "SHP-1066", company: "Yellowbrick Media", owner: "Zoë Laurent", plan: "Growth", status: "active", mrr: 495 },
  { id: "SHP-1067", company: "Zenith Aerospace", owner: "Oliver Hayes", plan: "Enterprise", status: "active", mrr: 4600 },
  { id: "SHP-1068", company: "Argent Trust", owner: "Beatriz Costa", plan: "Scale", status: "active", mrr: 1390 },
  { id: "SHP-1069", company: "Basalt Construction", owner: "Igor Melnyk", plan: "Growth", status: "active", mrr: 450 },
  { id: "SHP-1070", company: "Cirrus Cloudworks", owner: "Mei-Ling Chow", plan: "Scale", status: "trialing", mrr: 1150 },
  { id: "SHP-1071", company: "Delta Bridge Group", owner: "Kwame Mensah", plan: "Starter", status: "active", mrr: 119 },
  { id: "SHP-1072", company: "Evergreen Insurance", owner: "Astrid Berg", plan: "Enterprise", status: "active", mrr: 3600 },
  { id: "SHP-1073", company: "Fathom Research", owner: "Noor El-Sayed", plan: "Growth", status: "active", mrr: 505 },
  { id: "SHP-1074", company: "Glacier Cold Chain", owner: "Pavel Novák", plan: "Scale", status: "past_due", mrr: 1210 },
  { id: "SHP-1075", company: "Helix Biotech", owner: "Isabelle Moreau", plan: "Enterprise", status: "active", mrr: 4150 },
  { id: "SHP-1076", company: "Indigo Textiles", owner: "Arjun Mehta", plan: "Starter", status: "churned", mrr: 0 },
  { id: "SHP-1077", company: "Jetstream Airlines", owner: "Bianca Romano", plan: "Enterprise", status: "active", mrr: 4400 },
  { id: "SHP-1078", company: "Kilnworks Pottery", owner: "Tomas Silva", plan: "Starter", status: "active", mrr: 109 },
  { id: "SHP-1079", company: "Lyra Music", owner: "Anouk Visser", plan: "Growth", status: "active", mrr: 470 },
  { id: "SHP-1080", company: "Meridian Travel", owner: "Farid Haddad", plan: "Growth", status: "active", mrr: 555 },
  { id: "SHP-1081", company: "Nova Chemicals", owner: "Elena Vasquez", plan: "Scale", status: "active", mrr: 1330 },
  { id: "SHP-1082", company: "Onyx Jewelry", owner: "Signe Aalto", plan: "Starter", status: "trialing", mrr: 99 },
  { id: "SHP-1083", company: "Pinnacle Sports", owner: "Diego Fernández", plan: "Growth", status: "past_due", mrr: 530 },
  { id: "SHP-1084", company: "Quantum Print", owner: "Hana Kimura", plan: "Starter", status: "active", mrr: 115 },
  { id: "SHP-1085", company: "Riverstone Finance", owner: "Callum Fraser", plan: "Scale", status: "active", mrr: 1260 },
]
