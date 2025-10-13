import type { Schema, Struct } from '@strapi/strapi';

export interface KpCard extends Struct.ComponentSchema {
  collectionName: 'components_kp_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface KpFeatured1 extends Struct.ComponentSchema {
  collectionName: 'components_kp_featured_1s';
  info: {
    displayName: 'Featured 1';
  };
  attributes: {
    actionButton: Schema.Attribute.Component<'kp.nav-item', false>;
    features: Schema.Attribute.Component<'kp.text-list', true>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    infoButton: Schema.Attribute.Component<'kp.nav-item', false>;
    variants: Schema.Attribute.Component<'kp.featured-variants', true>;
  };
}

export interface KpFeatured2 extends Struct.ComponentSchema {
  collectionName: 'components_kp_featured_2s';
  info: {
    displayName: 'Featured 2';
  };
  attributes: {
    actionButton: Schema.Attribute.Component<'kp.nav-item', false>;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    variants: Schema.Attribute.Component<'kp.featured-variants', true>;
  };
}

export interface KpFeaturedVariants extends Struct.ComponentSchema {
  collectionName: 'components_kp_featured_variants';
  info: {
    displayName: 'Image Links';
  };
  attributes: {
    href: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface KpNavItem extends Struct.ComponentSchema {
  collectionName: 'components_kp_nav_items';
  info: {
    displayName: 'Link';
  };
  attributes: {
    blank: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface KpNavMenu extends Struct.ComponentSchema {
  collectionName: 'components_kp_nav_menus';
  info: {
    displayName: 'Nav Menu';
  };
  attributes: {
    items: Schema.Attribute.Component<'kp.nav-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface KpOrderProduct extends Struct.ComponentSchema {
  collectionName: 'components_kp_order_products';
  info: {
    displayName: 'Order Product';
  };
  attributes: {
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    size: Schema.Attribute.String &
      Schema.Attribute.CustomField<
        'plugin::combobox.combobox',
        {
          defaultOptions: 'S\nM\nL\nXL\n2XL\n3XL';
        }
      >;
    sizeId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface KpPilicy extends Struct.ComponentSchema {
  collectionName: 'components_kp_pilicies';
  info: {
    displayName: 'Pilicy';
  };
  attributes: {
    items: Schema.Attribute.Component<'kp.text-list', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

export interface KpProductDefaults extends Struct.ComponentSchema {
  collectionName: 'components_kp_product_defaults';
  info: {
    displayName: 'Product defaults';
  };
  attributes: {
    fabricInfo: Schema.Attribute.Text;
    shippingInfo: Schema.Attribute.Text;
    sizeChart: Schema.Attribute.Media<'images'>;
    washInstructions: Schema.Attribute.Text;
  };
}

export interface KpProductFit extends Struct.ComponentSchema {
  collectionName: 'components_kp_product_fits';
  info: {
    displayName: 'Product Fit';
  };
  attributes: {
    items: Schema.Attribute.Component<'kp.product-fit-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    model: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface KpProductFitItem extends Struct.ComponentSchema {
  collectionName: 'components_kp_product_fit_items';
  info: {
    displayName: 'Product Fit Item';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    size: Schema.Attribute.String &
      Schema.Attribute.CustomField<
        'plugin::combobox.combobox',
        {
          customValidation: '/^.+$/';
          defaultOptions: 'S\nM\nL\nXL\n2XL\n3XL';
        }
      >;
  };
}

export interface KpProductSizes extends Struct.ComponentSchema {
  collectionName: 'components_kp_product_sizes';
  info: {
    displayName: 'Product sizes';
  };
  attributes: {
    price: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    stock: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<
        'plugin::combobox.combobox',
        {
          customValidation: '/^.+$/';
          defaultOptions: 'S\nM\nL\nXL\n2XL\n3XL';
        }
      >;
    wholesale: Schema.Attribute.Component<'kp.wholesale-price', true>;
  };
}

export interface KpProductVariants extends Struct.ComponentSchema {
  collectionName: 'components_kp_product_variants';
  info: {
    displayName: 'Product variants';
  };
  attributes: {
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    title: Schema.Attribute.String;
  };
}

export interface KpServiceItem extends Struct.ComponentSchema {
  collectionName: 'components_kp_service_items';
  info: {
    displayName: 'Service item';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface KpServicesSection extends Struct.ComponentSchema {
  collectionName: 'components_kp_services_sections';
  info: {
    displayName: 'Services section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'kp.service-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface KpTextList extends Struct.ComponentSchema {
  collectionName: 'components_kp_text_lists';
  info: {
    displayName: 'Text List';
  };
  attributes: {
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface KpWholesalePrice extends Struct.ComponentSchema {
  collectionName: 'components_kp_wholesale_prices';
  info: {
    displayName: 'Wholesale price';
  };
  attributes: {
    price: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface SharedOpenGraph extends Struct.ComponentSchema {
  collectionName: 'components_shared_open_graphs';
  info: {
    displayName: 'openGraph';
    icon: 'project-diagram';
  };
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    ogType: Schema.Attribute.String;
    ogUrl: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    openGraph: Schema.Attribute.Component<'shared.open-graph', false>;
    structuredData: Schema.Attribute.JSON;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'kp.card': KpCard;
      'kp.featured-1': KpFeatured1;
      'kp.featured-2': KpFeatured2;
      'kp.featured-variants': KpFeaturedVariants;
      'kp.nav-item': KpNavItem;
      'kp.nav-menu': KpNavMenu;
      'kp.order-product': KpOrderProduct;
      'kp.pilicy': KpPilicy;
      'kp.product-defaults': KpProductDefaults;
      'kp.product-fit': KpProductFit;
      'kp.product-fit-item': KpProductFitItem;
      'kp.product-sizes': KpProductSizes;
      'kp.product-variants': KpProductVariants;
      'kp.service-item': KpServiceItem;
      'kp.services-section': KpServicesSection;
      'kp.text-list': KpTextList;
      'kp.wholesale-price': KpWholesalePrice;
      'shared.open-graph': SharedOpenGraph;
      'shared.seo': SharedSeo;
    }
  }
}
