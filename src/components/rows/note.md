

/*
{
type: 'section_header',
id: string;
index: number;
isShowingAll: boolean;
}
{
type: 'items__textOnly',
data: [],
}
{
type: 'items__hasImage',
data: [],
}
{
type: 'items__horizontal',
data: [],
}
/////////////////////////
By Category
[id]: {
id: string;
title: string;
originalData: any[]; /// For `items__horizontal`
segments: {
`${portrait|landscape}_${columns}`: any[]; /// For `items__textOnly` and `items__hasImage`
}
}
*/
