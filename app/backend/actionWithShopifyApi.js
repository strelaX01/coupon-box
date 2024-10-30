// get collecetion list
export async function fetchCollectionList(admin) {
  try {
    const query = `
          query {
            collections(first: 10) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
        `;

    const response = await admin.graphql(query);

    const contentType = response.headers.get('content-type');

    let data;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return [];
      }
    }

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return [];
    }

    const collections = data.data.collections.edges.map(edge => {
      const collection = edge.node;
      return {
        id: collection.id,
        title: collection.title
      };
    });

    return collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

// get product list
export async function fetchProductList(admin) {

  try {
    const query = `
          query {
            products(first: 10) {
              edges {
                node {
                  id
                  title
                   images(first: 1) {
              edges {
                node {
                  src
                }
              }
            }
                  variants(first: 10) {
                    edges {
                      node {
                        id
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        `;

    const response = await admin.graphql(query);

    const contentType = response.headers.get('content-type');

    let data;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return [];
      }
    }
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return [];
    }
    const products = data.data.products.edges.map(edge => {
      const product = edge.node;
      const variants = product.variants.edges.map(variant => variant.node);
      const images = product.images.edges.map(image => image.node);

      return { ...product, variants, images };
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}


// get owner id
export async function getOwnerID(admin) {
  const appInstallation = await admin.graphql(`
        query {
          currentAppInstallation {
            id
          }
        }
    `);
  const appInstallationResp = await appInstallation.json();
  return appInstallationResp?.data?.currentAppInstallation?.id;
}



// get shop id
export async function getShopId(admin) {
  const response = await admin.graphql(`
  #graphql
        query {
          shop {
            id
          }
        }
    `);
  const data = await response.json();
  const shopId = data?.data?.shop?.id.replace("gid://shopify/Shop/", "");
  ;
  return shopId;
}

//create general settings shop metafield
export async function GeneralMetafield(admin, settings) {
  const metafields = JSON.stringify(settings);
  const shopId = await getShopId(admin); 

  try {
    const response = await admin.graphql(
      `mutation CreateShopMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafieldsSetInput) {
          metafields {
            id
            namespace
            key
            value
            type
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          metafieldsSetInput: [
            {
              namespace: "GeneralSettings",
              key: "GeneralSettings",
              type: "json",
              value: metafields,
              ownerId: `gid://shopify/Shop/${shopId}`, 
            },
          ],
        },
      }
    );

    if (!response.ok) {
      return { error: "Request failed", status: response.status };
    }

    const result = await response.json();

    if (!result.data || !result.data.metafieldsSet) {
      console.error("Unexpected response structure:", result);
      return { error: "Unexpected response structure", status: 500 };
    }

    if (result.data.metafieldsSet.userErrors.length > 0) {
      console.error("Errors while saving shop general settings:", result.data.metafieldsSet.userErrors);
      return { error: "Unable to create shop general setting", status: 400 };
    }

    return { success: true, metafields: result.data.metafieldsSet.metafields };
  } catch (error) {
    console.error("Error creating shop general setting:", error);
    return { error: "Unable to create shop general setting", status: 500 };
  }
}


// get general settings shop metafield
export async function getGeneralMetafield(admin) {
  try {
    const query = `
      query {
        shop {
          metafields(first: 100, namespace: "GeneralSettings") {
            edges {
              node {
                id
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
    `;

    const response = await admin.graphql(query);

    const contentType = response.headers.get('content-type');

    let data;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return { error: "Unable to parse response", status: 500 };
      }
    }

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return { error: "Unable to fetch shop general settings", status: 400 };
    }

    const metafield = data.data.shop.metafields.edges[0]?.node;

    if (!metafield) {
      return { error: "No general setting metafield found", status: 404 };
    }

    const generalSettings = JSON.parse(metafield.value);

    return {
      success: true,
      generalSettings,
    };
  } catch (error) {
    console.error('Error fetching general settings metafield:', error);
    return { error: "Unable to fetch general settings", status: 500 };
  }
}


// create discountsettings shop metafield
export async function DiscountMetafield(admin, settings) {
  const metafields = JSON.stringify(settings);
  const shopId = await getShopId(admin); 

  try {
    const response = await admin.graphql(
      `mutation CreateShopMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafieldsSetInput) {
          metafields {
            id
            namespace
            key
            value
            type
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          metafieldsSetInput: [
            {
              namespace: "DiscountSettings",
              key: "DiscountSettings",
              type: "json",
              value: metafields,
              ownerId: `gid://shopify/Shop/${shopId}`, 
            },
          ],
        },
      }
    );

    if (!response.ok) {
      return { error: "Request failed", status: response.status };
    }

    const result = await response.json();

    if (!result.data || !result.data.metafieldsSet) {
      console.error("Unexpected response structure:", result);
      return { error: "Unexpected response structure", status: 500 };
    }

    if (result.data.metafieldsSet.userErrors.length > 0) {
      console.error("Errors while saving shop discount settings:", result.data.metafieldsSet.userErrors);
      return { error: "Unable to create shop discount setting", status: 400 };
    }

    return { success: true, metafields: result.data.metafieldsSet.metafields };
  } catch (error) {
    console.error("Error creating shop discount setting:", error);
    return { error: "Unable to create shop discount setting", status: 500 };
  }
}


// get discountsettings shop metafield
export async function getDiscountMetafield(admin) {
  try {
    const query = `
      query {
        shop {
          metafields(first: 100, namespace: "DiscountSettings") {
            edges {
              node {
                id
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
    `;

    const response = await admin.graphql(query);

    const contentType = response.headers.get('content-type');

    let data;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return { error: "Unable to parse response", status: 500 };
      }
    }

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return { error: "Unable to fetch shop discount settings", status: 400 };
    }

    const metafield = data.data.shop.metafields.edges[0]?.node;

    if (!metafield) {
      return { error: "No discount setting metafield found", status: 404 };
    }

    const discountSettings = JSON.parse(metafield.value);

    return {
      success: true,
      discountSettings,
    };
  } catch (error) {
    console.error('Error fetching discount settings metafield:', error);
    return { error: "Unable to fetch discount settings", status: 500 };
  }
}


// create mailchimp setting shop metafield
export async function CreateMailchimpMetafield(admin, settings) {
  const metafields = JSON.stringify(settings);
  const shopId = await getShopId(admin); 

  try {
    const response = await admin.graphql(
      `mutation CreateShopMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafieldsSetInput) {
          metafields {
            id
            namespace
            key
            value
            type
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          metafieldsSetInput: [
            {
              namespace: "MailchimpSettings",
              key: "MailchimpSettings",
              type: "json",
              value: metafields,
              ownerId: `gid://shopify/Shop/${shopId}`, 
            },
          ],
        },
      }
    );

    if (!response.ok) {
      return { error: "Request failed", status: response.status };
    }

    const result = await response.json();

    if (!result.data || !result.data.metafieldsSet) {
      console.error("Unexpected response structure:", result);
      return { error: "Unexpected response structure", status: 500 };
    }

    if (result.data.metafieldsSet.userErrors.length > 0) {
      console.error("Errors while saving shop mailchimp settings:", result.data.metafieldsSet.userErrors);
      return { error: "Unable to create shop mailchimp setting", status: 400 };
    }

    return { success: true, metafields: result.data.metafieldsSet.metafields };
  } catch (error) {
    console.error("Error creating shop mailchimp setting:", error);
    return { error: "Unable to create shop mailchimp setting", status: 500 };
  }

}

// get mailchimp setting shop metafield
export async function getMailchimpMetafield(admin) {
  try {
    const query = `
      query {
        shop {
          metafields(first: 100, namespace: "MailchimpSettings") {
            edges {
              node {
                id
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
    `;

    const response = await admin.graphql(query);

    const contentType = response.headers.get('content-type');

    let data;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return { error: "Unable to parse response", status: 500 };
      }
    }

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return { error: "Unable to fetch shop mailchimp settings", status: 400 };
    }

    const metafield = data.data.shop.metafields.edges[0]?.node;

    if (!metafield) {
      return { error: "No mailchimp setting metafield found", status: 404 };
    }

    const mailchimpSettings = JSON.parse(metafield.value);

    return {
      success: true,
      mailchimpSettings,
    };
  } catch (error) {
    console.error('Error fetching mailchimp settings metafield:', error);
    return { error: "Unable to fetch mailchimp settings", status: 500 };
  }
}


// create capcha setting shop metafield
export async function CreateCapChaMetafield(admin, settings) {
  const metafields = JSON.stringify(settings);
  const shopId = await getShopId(admin); 

  try {
    const response = await admin.graphql(
      `mutation CreateShopMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafieldsSetInput) {
          metafields {
            id
            namespace
            key
            value
            type
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          metafieldsSetInput: [
            {
              namespace: "CapChaSettings",
              key: "CapChaSettings",
              type: "json",
              value: metafields,
              ownerId: `gid://shopify/Shop/${shopId}`, 
            },
          ],
        },
      }
    );

    if (!response.ok) {
      return { error: "Request failed", status: response.status };
    }

    const result = await response.json();

    if (!result.data || !result.data.metafieldsSet) {
      console.error("Unexpected response structure:", result);
      return { error: "Unexpected response structure", status: 500 };
    }

    if (result.data.metafieldsSet.userErrors.length > 0) {
      console.error("Errors while saving shop capcha settings:", result.data.metafieldsSet.userErrors);
      return { error: "Unable to create shop capcha setting", status: 400 };
    }

    return { success: true, metafields: result.data.metafieldsSet.metafields };
  } catch (error) {
    console.error("Error creating shop capcha setting:", error);
    return { error: "Unable to create shop capcha setting", status: 500 };
  }
}

// get capcha setting shop metafield
export async function getCapChaMetafield(admin) {
  try {
    const query = `
      query {
        shop {
          metafields(first: 100, namespace: "CapChaSettings") {
            edges {
              node {
                id
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
    `;

    const response = await admin.graphql(query);

    const contentType = response.headers.get('content-type');

    let data;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return { error: "Unable to parse response", status: 500 };
      }
    }

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return { error: "Unable to fetch shop capcha settings", status: 400 };
    }

    const metafield = data.data.shop.metafields.edges[0]?.node;

    if (!metafield) {
      return { error: "No capcha setting metafield found", status: 404 };
    }

    const capchaSettings = JSON.parse(metafield.value);

    return {
      success: true,
      capchaSettings,
    };
    
  } catch (error) {
    console.error('Error fetching capcha settings metafield:', error);
    return { error: "Unable to fetch capcha settings", status: 500 };
  }
}


