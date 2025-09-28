"use client"

import type React from "react"

import type { MailingAddressInput } from "@shopify/hydrogen/storefront-api-types"
import type { AddressFragment, CustomerFragment } from "storefrontapi.generated"
import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@shopify/remix-oxygen"
import { Form, useActionData, useNavigation, useOutletContext, type MetaFunction } from "@remix-run/react"
import { useState } from "react"

export type ActionResponse = {
  addressId?: string | null
  createdAddress?: AddressFragment
  defaultAddress?: string | null
  deletedAddress?: string | null
  error: Record<AddressFragment["id"], string> | null
  updatedAddress?: AddressFragment
}

export const meta: MetaFunction = () => {
  return [{ title: "Addresses" }]
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { session } = context
  const customerAccessToken = await session.get("customerAccessToken")
  if (!customerAccessToken) {
    return redirect("/account/login")
  }
  return {}
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { storefront, session } = context

  try {
    const form = await request.formData()

    const addressId = form.has("addressId") ? String(form.get("addressId")) : null
    if (!addressId) {
      throw new Error("You must provide an address id.")
    }

    const customerAccessToken = await session.get("customerAccessToken")
    if (!customerAccessToken) {
      return data({ error: { [addressId]: "Unauthorized" } }, { status: 401 })
    }
    const { accessToken } = customerAccessToken

    const defaultAddress = form.has("defaultAddress") ? String(form.get("defaultAddress")) === "on" : null
    const address: MailingAddressInput = {}
    const keys: (keyof MailingAddressInput)[] = [
      "address1",
      "address2",
      "city",
      "company",
      "country",
      "firstName",
      "lastName",
      "phone",
      "province",
      "zip",
    ]

    for (const key of keys) {
      const value = form.get(key)
      if (typeof value === "string") {
        address[key] = value
      }
    }

    switch (request.method) {
      case "POST": {
        try {
          const { customerAddressCreate } = await storefront.mutate(CREATE_ADDRESS_MUTATION, {
            variables: { customerAccessToken: accessToken, address },
          })

          if (customerAddressCreate?.customerUserErrors?.length) {
            const error = customerAddressCreate.customerUserErrors[0]
            throw new Error(error.message)
          }

          const createdAddress = customerAddressCreate?.customerAddress
          if (!createdAddress?.id) {
            throw new Error("Expected customer address to be created, but the id is missing")
          }

          if (defaultAddress) {
            const createdAddressId = decodeURIComponent(createdAddress.id)
            const { customerDefaultAddressUpdate } = await storefront.mutate(UPDATE_DEFAULT_ADDRESS_MUTATION, {
              variables: {
                customerAccessToken: accessToken,
                addressId: createdAddressId,
              },
            })

            if (customerDefaultAddressUpdate?.customerUserErrors?.length) {
              const error = customerDefaultAddressUpdate.customerUserErrors[0]
              throw new Error(error.message)
            }
          }

          return { error: null, createdAddress, defaultAddress }
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data({ error: { [addressId]: error.message } }, { status: 400 })
          }
          return data({ error: { [addressId]: error } }, { status: 400 })
        }
      }

      case "PUT": {
        try {
          const { customerAddressUpdate } = await storefront.mutate(UPDATE_ADDRESS_MUTATION, {
            variables: {
              address,
              customerAccessToken: accessToken,
              id: decodeURIComponent(addressId),
            },
          })

          const updatedAddress = customerAddressUpdate?.customerAddress

          if (customerAddressUpdate?.customerUserErrors?.length) {
            const error = customerAddressUpdate.customerUserErrors[0]
            throw new Error(error.message)
          }

          if (defaultAddress) {
            const { customerDefaultAddressUpdate } = await storefront.mutate(UPDATE_DEFAULT_ADDRESS_MUTATION, {
              variables: {
                customerAccessToken: accessToken,
                addressId: decodeURIComponent(addressId),
              },
            })

            if (customerDefaultAddressUpdate?.customerUserErrors?.length) {
              const error = customerDefaultAddressUpdate.customerUserErrors[0]
              throw new Error(error.message)
            }
          }

          return { error: null, updatedAddress, defaultAddress }
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data({ error: { [addressId]: error.message } }, { status: 400 })
          }
          return data({ error: { [addressId]: error } }, { status: 400 })
        }
      }

      case "DELETE": {
        try {
          const { customerAddressDelete } = await storefront.mutate(DELETE_ADDRESS_MUTATION, {
            variables: { customerAccessToken: accessToken, id: addressId },
          })

          if (customerAddressDelete?.customerUserErrors?.length) {
            const error = customerAddressDelete.customerUserErrors[0]
            throw new Error(error.message)
          }
          return { error: null, deletedAddress: addressId }
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data({ error: { [addressId]: error.message } }, { status: 400 })
          }
          return data({ error: { [addressId]: error } }, { status: 400 })
        }
      }

      default: {
        return data({ error: { [addressId]: "Method not allowed" } }, { status: 405 })
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data({ error: error.message }, { status: 400 })
    }
    return data({ error }, { status: 400 })
  }
}

function MessageDisplay({ action }: { action: ActionResponse | undefined }) {
  if (!action) return null

  const hasSuccess = action.createdAddress || action.updatedAddress || action.deletedAddress
  const hasError = action.error && typeof action.error === "object" && Object.keys(action.error).length > 0

  if (hasSuccess) {
    let message = ""
    if (action.createdAddress) {
      message = "Address created successfully!"
    } else if (action.updatedAddress) {
      message = "Address updated successfully!"
    } else if (action.deletedAddress) {
      message = "Address deleted successfully!"
    }

    return (
      <div className="mb-6 bg-black border  rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-[13px] outfit font-normal text-primary">{message}</p>
          </div>
        </div>
      </div>
    )
  }

  if (hasError && typeof action.error === "object") {
    const errorMessages = Object.values(action?.error ?? {}).filter(Boolean)
    if (errorMessages.length === 0) return null

    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">There was an error with your request</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc pl-5 space-y-1">
                {errorMessages.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default function Addresses() {
  const { customer } = useOutletContext<{ customer: CustomerFragment }>()
  const { defaultAddress, addresses } = customer
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const action = useActionData<ActionResponse>()

  return (
    <div className="w-full relative md:max-w-[850px] max-w-full md:px-[20px] md:pt-0 pt-[25px] mx-auto">
      <h2 className="text-[24px] playfairsb text-primary mb-6">Addresses</h2>

      <MessageDisplay action={action} />

      {!addresses.nodes.length && !showNewAddressForm ? (
        <div className="text-center py-12">
          <p className="text-primary playfairsb mb-6">You have no addresses saved.</p>
          <button
            onClick={() => setShowNewAddressForm(true)}
            className="inline-flex absolute right-0 top-0 border border-[#09090a] items-center px-4 py-2 outfit rounded-[3px] text-primary  focus:outline-none"
          >
            Add New Address
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            {!showNewAddressForm && (
              <button
                onClick={() => setShowNewAddressForm(true)}
                className="h-[45px] px-4 py-2 absolute top-0 right-0 md:w-[200px] bg-transparent gradient-border-shade text-[13px] outfit font-light text-primary rounded-[8px] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add New Address
              </button>
            )}
            {showNewAddressForm && (
              <div className="">
                <h3 className="text-[16px] playfairsb text-primary mb-4">Create New Address</h3>
                <NewAddressForm onCancel={() => setShowNewAddressForm(false)} />
              </div>
            )}
          </div>
          {addresses.nodes.length > 0 && (
            <div>
              <h3 className="text-[16px] playfairsb text-primary mb-4">Existing Addresses</h3>
              <ExistingAddresses addresses={addresses} defaultAddress={defaultAddress} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function NewAddressForm({ onCancel }: { onCancel: () => void }) {
  const newAddress = {
    address1: "",
    address2: "",
    city: "",
    company: "",
    country: "",
    firstName: "",
    id: "new",
    lastName: "",
    phone: "",
    province: "",
    zip: "",
  } as AddressFragment

  return (
    <AddressForm address={newAddress} defaultAddress={null}>
      {({ stateForMethod }) => (
        <div className="flex gap-3 pt-4">
          <button
            disabled={stateForMethod("POST") !== "idle"}
            formMethod="POST"
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-solid bg-transparent text-primary rounded-md text-[13px] outfit font-light focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {stateForMethod("POST") !== "idle" ? "Creating..." : "Create Address"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-solid bg-transparent text-primary rounded-md text-[13px] outfit font-light focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </AddressForm>
  )
}

function ExistingAddresses({ addresses, defaultAddress }: Pick<CustomerFragment, "addresses" | "defaultAddress">) {
  return (
    <div className="grid gap-6">
      {addresses.nodes.map((address) => (
        <AddressForm key={address.id} address={address} defaultAddress={defaultAddress}>
          {({ stateForMethod }) => (
            <div className="flex gap-3 pt-4">
              <button
                disabled={stateForMethod("PUT") !== "idle"}
                formMethod="PUT"
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-solid bg-transparent text-primary rounded-md text-[13px] outfit font-light focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {stateForMethod("PUT") !== "idle" ? "Saving..." : "Save"}
              </button>
              <button
                disabled={stateForMethod("DELETE") !== "idle"}
                formMethod="DELETE"
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-solid bg-transparent text-primary rounded-md text-[13px] outfit font-light focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {stateForMethod("DELETE") !== "idle" ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </AddressForm>
      ))}
    </div>
  )
}

export function AddressForm({
  address,
  defaultAddress,
  children,
}: {
  children: (props: {
    stateForMethod: (method: "PUT" | "POST" | "DELETE") => ReturnType<typeof useNavigation>["state"]
  }) => React.ReactNode
  defaultAddress: CustomerFragment["defaultAddress"]
  address: AddressFragment
}) {
  const { state, formMethod } = useNavigation()
  const action = useActionData<ActionResponse>()
  const error = action?.error?.[address.id]
  const isDefaultAddress = defaultAddress?.id === address.id

  return (
    <Form id={address.id} className="py-4 pb-6">
      <fieldset className="space-y-4">
        <input type="hidden" name="addressId" defaultValue={address.id} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-[12px] outfit font-normal text-primary mb-1">
              First name*
            </label>
            <input
              aria-label="First name"
              autoComplete="given-name"
              defaultValue={address?.firstName ?? ""}
              id="firstName"
              name="firstName"
              placeholder="First name"
              required
              type="text"
              className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-[12px] outfit font-normal text-primary mb-1">
              Last name*
            </label>
            <input
              aria-label="Last name"
              autoComplete="family-name"
              defaultValue={address?.lastName ?? ""}
              id="lastName"
              name="lastName"
              placeholder="Last name"
              required
              type="text"
              className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-[12px] outfit font-normal text-primary mb-1">
            Company
          </label>
          <input
            aria-label="Company"
            autoComplete="organization"
            defaultValue={address?.company ?? ""}
            id="company"
            name="company"
            placeholder="Company"
            type="text"
            className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent"
          />
        </div>

        <div>
          <label htmlFor="address1" className="block text-[12px] outfit font-normal text-primary mb-1">
            Address line*
          </label>
          <input
            aria-label="Address line 1"
            autoComplete="address-line1"
            defaultValue={address?.address1 ?? ""}
            id="address1"
            name="address1"
            placeholder="Address line 1"
            required
            type="text"
            className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent"
          />
        </div>

        <div>
          <label htmlFor="address2" className="block text-[12px] outfit font-normal text-primary mb-1">
            Address line 2
          </label>
          <input
            aria-label="Address line 2"
            autoComplete="address-line2"
            defaultValue={address?.address2 ?? ""}
            id="address2"
            name="address2"
            placeholder="Address line 2"
            type="text"
            className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-[12px] outfit font-normal text-primary mb-1">
              City*
            </label>
            <input
              aria-label="City"
              autoComplete="address-level2"
              defaultValue={address?.city ?? ""}
              id="city"
              name="city"
              placeholder="City"
              required
              type="text"
              className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent"
            />
          </div>

          <div>
            <label htmlFor="province" className="block text-[12px] outfit font-normal text-primary mb-1">
              State / Province*
            </label>
            <input
              aria-label="State"
              autoComplete="address-level1"
              defaultValue={address?.province ?? ""}
              id="province"
              name="province"
              placeholder="State / Province"
              required
              type="text"
              className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zip" className="block text-[12px] outfit font-normal text-primary mb-1">
              Zip / Postal Code*
            </label>
            <input
              aria-label="Zip"
              autoComplete="postal-code"
              defaultValue={address?.zip ?? ""}
              id="zip"
              name="zip"
              placeholder="Zip / Postal Code"
              required
              type="text"
              className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-[12px] outfit font-normal text-primary mb-1">
              Country*
            </label>
            <input
              aria-label="Country"
              autoComplete="country-name"
              defaultValue={address?.country ?? ""}
              id="country"
              name="country"
              placeholder="Country"
              required
              type="text"
              className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-[12px] outfit font-normal text-primary mb-1">
            Phone
          </label>
          <input
            aria-label="Phone"
            autoComplete="tel"
            defaultValue={address?.phone ?? ""}
            id="phone"
            name="phone"
            placeholder="+16135551111"
            pattern="^\+?[1-9]\d{3,14}$"
            type="tel"
            className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-primary bg-white focus:outline-none focus:ring-2 focus:ring-transparent"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            defaultChecked={isDefaultAddress}
            id="defaultAddress"
            name="defaultAddress"
            type="checkbox"
            className="accent-black bg-white border border-gray-400 rounded"
          />
          <label htmlFor="defaultAddress" className="block text-[14px] outfit font-normal text-primary mb-1">
            Set as default address
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {children({
          stateForMethod: (method) => (formMethod === method ? state : "idle"),
        })}
      </fieldset>
    </Form>
  )
}

const UPDATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressUpdate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
 ) @inContext(country: $country, language: $language) {
    customerAddressUpdate(
      address: $address
      customerAccessToken: $customerAccessToken
      id: $id
    ) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const

const DELETE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressDelete(
    $customerAccessToken: String!,
    $id: ID!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      customerUserErrors {
        code
        field
        message
      }
      deletedCustomerAddressId
    }
  }
` as const

const UPDATE_DEFAULT_ADDRESS_MUTATION = `#graphql
  mutation customerDefaultAddressUpdate(
    $addressId: ID!
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerDefaultAddressUpdate(
      addressId: $addressId
      customerAccessToken: $customerAccessToken
    ) {
      customer {
        defaultAddress {
          id
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const

const CREATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressCreate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerAddressCreate(
      address: $address
      customerAccessToken: $customerAccessToken
    ) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const