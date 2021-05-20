export interface I_HtmlParserNode {
  type: string;
  content?: string;
  voidElement: boolean;
  name: string;
  attrs: {
    [key: string]: string|boolean|number
  };
  children: I_HtmlParserNode[];
  selfIndex?: number;
  selfNodeList?: I_HtmlParserNode[];
  parentNode?: I_HtmlParserNode
  isLast?: boolean
}
