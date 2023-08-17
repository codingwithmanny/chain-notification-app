"use client";

import { useMutation } from "@tanstack/react-query";
// Imports
// ========================================================
import { useState } from "react";

// Main Page Component
// ========================================================
const Home = () => {
  // State / Props
  const [inputs, setInputs] = useState<{
    network: string;
    contractAddress: string;
    contractABICode?: string;
    functionName?: string;
    functionValueType?: string;
    functionValue?: string;
    functionValueIndex?: number;
    operator?: string;
    conditionValue?: string;
    email?: string;
  }>({
    network: "mumbai",
    contractAddress: "",
    contractABICode: "",
    functionName: "",
    functionValueType: "",
    functionValue: "",
    functionValueIndex: 0,
    operator: "",
    conditionValue: "",
    email: "",
  });

  // Requests
  /**
   *
   */
  const createAlert = useMutation(
    async (inputs: any) => {
      const res = await fetch("/api/jobs", {
        method: "POST",
        body: JSON.stringify(inputs),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
    {
      onSuccess: () => {
        alert("Notification Created!");
      },
    }
  );

  // Functions
  /**
   *
   */
  const isValidJSON = (json: string) => {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   *
   * @param address
   * @returns
   */
  const isValidContractAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  /**
   *
   * @param abi
   * @returns
   */
  const ABIFunctions = (abi: string) => {
    const parsedABI = JSON.parse(abi);
    if (!parsedABI.abi) return [];
    return parsedABI.abi.filter(
      (item: any) => item.type === "function" && item.outputs.length > 0
    );
  };

  /**
   *
   */
  const isAllValid =
    inputs.contractAddress &&
    inputs.contractABICode &&
    isValidJSON(inputs.contractABICode) &&
    isValidContractAddress(inputs.contractAddress);

  /**
   *
   */
  const isValuesSet =
    inputs.functionName &&
    inputs.functionValueType &&
    inputs.operator &&
    inputs.conditionValue;

  /**
   *
   */
  const isLoading = createAlert.isLoading;

  // Render
  return (
    <>
      <header className="border-b border-zinc-100">
        <div className="p-8">
          <h1 className=" text-6xl font-extrabold tracking-tight text-zinc-800 mb-2">
            Chain Notification App
          </h1>
          <p className="text-zinc-500">
            A way to be notified when a contract public value has met a specific
            criteria.
          </p>
        </div>
      </header>
      <main className="flex">
        <section className="p-8 w-full max-w-lg border-r border-zinc-100 h-screen">
          <div>
            <h2 className="text-2xl font-bold text-zinc-700 mb-4">Contract</h2>
            <form>
              <div className="mb-4">
                <label
                  className="block text-sm text-zinc-400 mb-2"
                  htmlFor="network"
                >
                  Network
                </label>
                <select
                  disabled={isLoading}
                  value={inputs.network}
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      network: e.target.value,
                    });
                  }}
                  className="disabled:bg-zinc-200 disabled:opacity-50 w-full border border-zinc-200 px-3 h-10 rounded-md"
                >
                  <option value="" disabled>
                    Select A Network
                  </option>
                  <option value={"mumbai"}>mumbai</option>
                  {/* <option value={"mainnet"}>mainnet</option>
                  <option value={"goerli"}>goerli</option>
                  <option value={"mumbai"}>mumbai</option>
                  <option value={"polygon mainnet"}>polygon mainnet</option> */}
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="text-sm text-zinc-400 block mb-2"
                  htmlFor="contractAddress"
                >
                  Contract Address
                </label>
                <input
                  disabled={isLoading}
                  value={inputs.contractAddress}
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      contractAddress: e.target.value,
                    });
                  }}
                  className="w-full border border-zinc-200 leading-10 rounded-md px-4"
                  id="contractAddress"
                  type="text"
                  placeholder="0x000..."
                />

                {inputs.contractAddress &&
                !isValidContractAddress(inputs.contractAddress) ? (
                  <div className="mt-2 bg-red-100 text-red-500 border border-red-200 leading-8 px-3 py-1 rounded">
                    Invalid Contract Address
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  className="block text-sm text-zinc-400 mb-2"
                  htmlFor="contratABI"
                >
                  Contract ABI JSON
                </label>
                <textarea
                  disabled={isLoading}
                  value={inputs.contractABICode}
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      contractABICode: e.target.value,
                    });
                  }}
                  placeholder={`Example: \n${JSON.stringify(
                    {
                      abi: [
                        {
                          anonymous: false,
                          inputs: [
                            {
                              indexed: true,
                              internalType: "address",
                              name: "previousOwner",
                              type: "address",
                            },
                            {
                              indexed: true,
                              internalType: "address",
                              name: "newOwner",
                              type: "address",
                            },
                          ],
                          name: "OwnershipTransferred",
                          type: "event",
                        },
                      ],
                    },
                    null,
                    2
                  )}`}
                  rows={10}
                  className="w-full border border-zinc-200 leading-8 py-2 rounded-md px-4"
                  id="contratABI"
                />

                {inputs.contractABICode && !isValidJSON(inputs.contractABICode) ? (
                  <div className="mt-2 bg-red-100 text-red-500 border border-red-200 leading-8 px-3 py-1 rounded">
                    Invalid JSON
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </section>

        <section className="p-8 w-full max-w-md border-r border-zinc-100 h-screen">
          {isAllValid ? (
            <div>
              <h2 className="text-2xl font-bold text-zinc-700 mb-4">
                Condition
              </h2>
              <form>
                <div className="mb-4">
                  <label
                    className="block text-sm text-zinc-400 mb-2"
                    htmlFor="functionName"
                  >
                    Function To Track
                  </label>
                  <select
                    disabled={isLoading}
                    value={inputs.functionName}
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        functionName: e.target.value,
                      });
                    }}
                    className="w-full border border-zinc-200 px-3 h-10 rounded-md"
                  >
                    <option value="" disabled>Select A Function</option>
                    {ABIFunctions(inputs.contractABICode || "").map(
                      (item: any, key: number) => {
                        return (
                          <option key={`function-${key}`} value={item.name}>
                            {item.name}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>
                {inputs.functionName ? (
                  <div>
                    <div className="mb-4">
                      <label
                        className="block text-sm text-zinc-400 mb-2"
                        htmlFor="functionValue"
                      >
                        Function Value To Track
                      </label>
                      <select
                        disabled={isLoading}
                        value={inputs.functionValue}
                        onChange={(e) => {
                          console.log('e.target.value', e.target.value)
                          const outputs = ABIFunctions(
                            inputs.contractABICode || ""
                          ).find(
                            (func: any) => func.name === inputs.functionName
                          )?.outputs;
                          const value = outputs?.find(
                            (item: any) => item.name === e.target.value
                          );
                          const valueIndex = outputs?.findIndex(
                            (item: any) => item.name === e.target.value
                          );
                          console.log('value', value);
                          console.log('valueIndex', valueIndex)

                          setInputs({
                            ...inputs,
                            functionValue: e.target.value,
                            functionValueType: value.type,
                            functionValueIndex: valueIndex,
                          });
                        }}
                        className="w-full border border-zinc-200 px-3 h-10 rounded-md"
                      >
                        <option value="" disabled>Select A Function Output Value</option>
                        {ABIFunctions(inputs.contractABICode || "")
                          .find(
                            (func: any) => func.name === inputs.functionName
                          )
                          ?.outputs?.map((item: any, key: number) => {
                            return (
                              <option key={`value-${key}`} value={item?.name}>
                                {String(item?.name).length > 0 ? item.name : item.type} ({item.type})
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm text-zinc-400 mb-2"
                        htmlFor="functionValue"
                      >
                        Operator
                      </label>
                      <select
                        disabled={!inputs.functionValueType || isLoading}
                        value={inputs.operator}
                        onChange={(e) => {
                          setInputs({
                            ...inputs,
                            operator: e.target.value,
                          });
                        }}
                        className="disabled:bg-zinc-200 disabled:opacity-50 w-full border border-zinc-200 px-3 h-10 rounded-md"
                      >
                        <option value="">Select An Operator</option>
                        <option value={">"}>&gt;</option>
                        <option value={"<"}>&lt;</option>
                        <option value={"=="}>==</option>
                        <option value={"!="}>!=</option>
                        <option value={">="}>&gt;=</option>
                        <option value={"<="}>&lt;=</option>
                        <option value={"==="}>===</option>
                        <option value={"!=="}>!==</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        className="text-sm text-zinc-400 block mb-2"
                        htmlFor="conditionValue"
                      >
                        Condition Value
                      </label>
                      <input
                        disabled={!inputs.operator || isLoading}
                        value={inputs.conditionValue}
                        onChange={(e) => {
                          setInputs({
                            ...inputs,
                            conditionValue: e.target.value,
                          });
                        }}
                        className="disabled:bg-zinc-200 disabled:opacity-50  w-full border border-zinc-200 leading-10 rounded-md px-4"
                        id="conditionValue"
                        type="text"
                        placeholder="1, 2, 3, a, b, c..."
                      />
                    </div>
                  </div>
                ) : null}
              </form>
            </div>
          ) : null}
        </section>

        {isValuesSet ? (
          <section className="p-8 w-full border-r border-zinc-100 h-screen">
            <div>
              <h2 className="text-2xl font-bold text-zinc-700 mb-4">Contact</h2>

              <div className="bg-amber-100 mb-4 text-sm leading-6 py-2 px-4 rounded-md border border-amber-400 text-amber-500">
                A cronjob will check every minute (* * * * *) to verify if the
                condition has been met.
              </div>

              <div className="bg-amber-100 mb-4 text-sm leading-6 py-2 px-4 rounded-md border border-amber-400 text-amber-500">
                After 10 attempts, the alert will be disabled.
              </div>

              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  await createAlert.mutateAsync(inputs);
                }}
              >
                <div className="mb-4">
                  <label
                    className="text-sm text-zinc-400 block mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    disabled={isLoading}
                    value={inputs?.email}
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        email: e.target.value,
                      });
                    }}
                    className="w-full border border-zinc-200 leading-10 rounded-md px-4"
                    id="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <button
                    disabled={!inputs.email || isLoading}
                    className="disabled:opacity-50 font-medium leading-10 rounded-md bg-blue-500 disabled:hover:bg-blue-500 text-white px-3 hover:bg-blue-700 transition-colors ease-in-out duration-200"
                    type="submit"
                  >
                    {isLoading ? <span>Loading...</span> : "Create Alert"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
};

// Exports
// ========================================================
export default Home;
