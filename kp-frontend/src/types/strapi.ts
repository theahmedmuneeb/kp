type Base = {
  id: number;
};

type Component = {
  __component: string;
} & Base;

export type User = Base & {
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
};

export type Link = {
  title: string;
  href: string;
  blank: boolean;
};

export type ImageBase = {
  url: string;
  name: string;
  size: number;
  width: number;
  height: number;
};

export type Image = ImageBase & {
  alternativeText: string | null;
  formats: {
    small: ImageBase;
    medium: ImageBase;
    thumbnail: ImageBase;
  };
};

export type FeaturedComponent = Component & {
  heading: string;
  image: Image;
  infoButton?: Link | null;
  actionButton?: Link | null;
  variants: FeatureVariants[] | [];
};

export type FeaturedComponent1 = {
  features: (Base & { text: string })[];
} & FeaturedComponent;

export type FeaturedComponent2 = {
  description: string;
} & FeaturedComponent;

export type FeatureVariants = {
  image: Image;
  title?: string;
  href: Link;
};

export type ProductSize = Base & {
  title: string;
  stock: number;
  price: number;
  wholesale: ProductWholesalePrice[];
};

export type ProductBase = {
  slug: string;
  title: string;
  titleAsVariant: string | null;
  description: string;
  price: number;
  images: Image[];
  sizes: ProductSize[];
} & Base;

export type Product = ProductBase & {
  variants: ProductBase[];
  wholesale: ProductWholesalePrice[];
  additional: ProductAdditionalOptions;
};

export type ProductWholesalePrice = Component & {
  quantity: number;
  price: number;
};

export type ProductAdditionalOptions = Base & {
  sizeChart: Image | null;
  washInstructions: String | null;
  shippingInfo: String | null;
  fabricInfo: String | null;
};

type Main = {
  data: {};
  meta: {};
};

export type CartContent = ({
  image: Image;
  size: {
    id: number;
    title: string;
  };
  quantity: number;
  total: number;
} & Omit<ProductBase, "description" | "sizes" | "images" | "titleAsVariant">)[];

export type CartItems = {
  data: Omit<
    Product,
    "description" | "variants" | "additional" | "titleAsVariant"
  >[];
};

export type ServiceItem = {
  title: string;
  description: string;
  image: Image;
};

export type Card = {
  title: string;
  content: string;
}

//================= Main Types =================

export interface Globals extends Main {
  data: {
    title: string;
    logo: Image;
    navigation: Array<
      | Link
      | {
          title: string;
          items: Link[];
        }
    >;
    mobileNavigation: Link[];
    headerButton: Link;
    footerLinks: Link[];
    product: {
      sizeChart: Image;
      washInstructions: String | null;
      shippingInfo: String | null;
      fabricInfo: String | null;
    };
  };
}

export interface Homepage extends Main {
  data: {
    featured: Array<FeaturedComponent1 | FeaturedComponent2>;
  };
}

export interface ProductPage extends Main {
  data: [Product] | [];
}

export interface Policy extends Main {
  data: {
    policy: {
      title: string;
      items: Array<
        Base & {
          text: string;
        }
      >;
    }[];
  };
}

export interface Services extends Main {
  data: {
    serviceSection1: {
      heading: string;
      description: string;
      items: ServiceItem[];
    };
    serviceSection2: {
      heading: string;
      description: string;
      items: ServiceItem[];
    };
    featuresHeading: string;
    features: Card[];
    ctaHeading: string;
    ctaButton: Link;
  };
}
