// @flow

declare type StyleSet = number | boolean | Object | Array<?StyleSet>;

declare type ReactNode = null | string | number | ReactElement<*> | Array<string | number | ReactElement<*>>;

type ImageSourceURI = {
  uri: string;
  width?: number;
  height?: number;
};

declare type ImageSource = number | ImageSourceURI | Array<ImageSourceURI>;
