import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Box, ContactRound, Truck } from 'lucide-react';

export default function Home() {
  return (
    <>
      <div className="bg-custom-bg bg-local bg-bottom bg-130 bg-no-repeat">
        <div className="text-center flex flex-col items-center mb-14">
          <h1 className="text-4xl md:text-7xl font-bold max-w-3xl">
            When the trusted third is the{' '}
            <span className="text-neonMintGreen block my-4">blockchain</span>
          </h1>
          <p className="font-['Onest'] text-sm text-slate-400 px-4 mb-10 md:max-w-xl">
            Eascrow leverages Soroban to provide secured escrow services for
            web3, guaranteeing fast and fraud-resistant payments.
          </p>
          <Link href="/dapp">
            <Button className="px-6 py-7 text-md rounded-xl  bg-custom-gradient hover:opacity-90 border border-slate-700 ">
              Get started now
            </Button>
          </Link>
        </div>
        <section className="flex flex-col items-center space-y-4 ">
          <div className="w-5/6 sm:w-3/4 max-w-4xl rounded-[25px] overflow-hidden">
            <Image
              src="/dashboard.webp"
              alt="Dashboard overview"
              width={800}
              height={450}
              layout="responsive"
              priority
              rel="preload"
            />
          </div>
        </section>
      </div>
      <div className="flex flex-col items-center text-slate-400 w-screen">
        <div className="items-center flex flex-col">
          <section className="w-full max-w-lg h-64 flex flex-col justify-center space-y-1">
            <p className="text-xl text-center text-slate-400">Trusted by</p>
            <div className="flex justify-evenly">
              <div>
                <Image
                  src="/stellar-logo.avif"
                  alt="Stellar Blockchain"
                  width={130}
                  height={10}
                />
              </div>
              <div className="flex flex-col justify-center">
                <Image
                  src="/soroban-logo.avif"
                  alt="Dashboard overview"
                  width={130}
                  height={50}
                />
              </div>
            </div>
          </section>
          <div id="about"></div>
          <Separator className="w-screen bg-gray-800 mb-10" />
          <section className="flex flex-col  items-center md:max-w-screen-lg mb-32">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4">
                <Image
                  src="/about-image.avif"
                  alt="Dashboard overview"
                  width={350}
                  height={10}
                />
              </div>
              <div className="text-center md:text-left flex flex-col items-center max-w-sm px-3 my-20 ">
                <h3 className="w-full text-customWhite text-4xl font-semibold mb-3">
                  About
                </h3>
                <p>
                  Eascrow is an innovative web3 escrow service that harnesses
                  the power of Soroban smart contracts to streamline and secure
                  online transactions. It acts as a trusted intermediary,
                  ensuring that funds are safely held and released according to
                  the terms agreed upon by the involved parties. Our service is
                  essential for various financial dealings, ranging from
                  material goods trade to freelance services.
                </p>
              </div>
            </div>
            <div id="features"></div>
            <Separator className="w-3/4 bg-gray-700 my-20" />
            <div className="flex flex-col items-center text-center mb-10 max-w-sm md:max-w-3xl">
              <h2 className="text-customWhite text-6xl font-bold mb-3">
                Features
              </h2>
              <p>
                The Problem: Traditional online transactions often face
                challenges like fraud, disputes over contract terms,
                inefficiencies in fund transfer, especially in international
                settings. These issues erode trust and complicate the
                transaction process.
              </p>
            </div>
            <div className="w-full px-2 flex flex-wrap justify-center items-center lg:justify-evenly ">
              <Card className="max-w-md md:max-w-xs bg-transparent border-gray-700 rounded-[30px] h-[400px] m-2 shadow-[inset_0_-10px_40px_rgba(52,69,92,0.25)] flex flex-col items-center text-center">
                <div className="w-16 h-16 shadow-lg shadow-black rounded-full flex justify-center items-center bg-[#212b38] my-10">
                  <Box color="#5cffb8" />
                </div>
                <CardTitle className="text-customWhite mb-4">
                  For individuals and Businesses
                </CardTitle>
                <CardContent className="text-slate-400 text-sm">
                  <p>
                    Eascrow reduces fraud risk by securely holding funds until
                    confirmation of goods delivery and satisfaction is received.
                    This streamlines the transaction process, providing
                    assurance to both buyers and sellers.
                  </p>
                </CardContent>
              </Card>
              <Card className="max-w-md md:max-w-xs bg-transparent border-gray-700 rounded-[30px] h-[400px] m-2 shadow-[inset_0_-10px_40px_rgba(52,69,92,0.25)] flex flex-col items-center text-center">
                <div className="w-16 h-16 shadow-lg shadow-black rounded-full flex justify-center items-center bg-[#212b38] my-10">
                  <ContactRound color="#5cffb8" />
                </div>
                <CardTitle className="text-customWhite mb-4">
                  For Freelancers and Employers
                </CardTitle>
                <CardContent className="text-slate-400 text-sm">
                  <p>
                    It ensures secure and streamlined payment for services,
                    holding funds until the completion of agreed work. This
                    simplifies the payment process and offers peace of mind to
                    both parties.
                  </p>
                </CardContent>
              </Card>
              <Card className="max-w-md md:max-w-xs bg-transparent border-gray-700 rounded-[30px] h-[400px] m-2 shadow-[inset_0_-10px_40px_rgba(52,69,92,0.25)] flex flex-col items-center text-center ">
                <div className="w-16 h-16 shadow-lg shadow-black rounded-full flex justify-center items-center bg-[#212b38] my-10">
                  <Truck color="#5cffb8" />
                </div>
                <CardTitle className="text-customWhite mb-4 mx-1">
                  For International Transactions
                </CardTitle>
                <CardContent className="text-slate-400 text-sm">
                  <p>
                    Eascrow simplifies and secures cross-border transactions
                    using Soroban smart contracts. It streamlines compliance
                    with international regulations, handling complexities like
                    currency exchange and legal requirements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          <section className="flex flex-col items-center mb-20 ">
            <div className="text-center flex flex-col items-center px-3 ">
              <h2 className="text-customWhite text-4xl md:text-5xl font-bold mb-10">
                Benefits of Eascrow
              </h2>
              <div className="w-full px-2 mb-20 space-y-5 lg:space-y-10 flex flex-col items-center lg:justify-evenly">
                <Card className="max-w-screen-lg bg-transparent border-gray-800 rounded-[30px] w-full p-4 shadow-inner flex flex-col md:flex-row items-center">
                  <div className="mb-4">
                    <Image
                      src="/security.avif"
                      alt="Dashboard overview"
                      width={500}
                      height={10}
                    />
                  </div>
                  <div className="md:text-left max-w-md">
                    <CardTitle className="text-3xl text-3xl text-customWhite mb-4">
                      Enhance Security
                    </CardTitle>
                    <CardContent className="text-slate-400 m-0 p-0">
                      <p>
                        Our smart contracts, thanks to Soroban, provide a clear,
                        immutable record of terms, fostering trust among
                        parties.
                      </p>
                    </CardContent>
                  </div>
                </Card>
                <Card className="max-w-screen-lg bg-transparent border-gray-800 rounded-[30px] w-full p-4 md:pl-16 shadow-inner flex flex-col md:flex-row items-center">
                  <div className="md:text-left max-w-md">
                    <CardTitle className="text-3xl text-customWhite mb-4 ">
                      Streamlined Process
                    </CardTitle>
                    <CardContent className="text-slate-400 m-0 p-0">
                      <p>
                        Simplifies and accelerates the transaction process, from
                        initiation to fund release
                      </p>
                    </CardContent>
                  </div>
                  <div className="mb-4">
                    <Image
                      src="/streamlined.avif"
                      alt="Dashboard overview"
                      width={500}
                      height={10}
                    />
                  </div>
                </Card>
                <Card className="max-w-screen-lg bg-transparent border-gray-800 rounded-[30px] w-full p-4 border-2 shadow-inner flex flex-col md:flex-row items-center">
                  <div className="mb-4">
                    <Image
                      src="/transparency.avif"
                      alt="Dashboard overview"
                      width={500}
                      height={10}
                    />
                  </div>
                  <div className="md:text-left max-w-md">
                    <CardTitle className="text-3xl text-customWhite mb-4 ">
                      Transparency and Trust
                    </CardTitle>
                    <CardContent className="text-slate-400 m-0 p-0">
                      <p>
                        Our smart contracts, thanks to Soroban, provide a clear,
                        immutable record of terms, fostering trust among
                        parties.
                      </p>
                    </CardContent>
                  </div>
                </Card>
                <Card className="max-w-screen-lg bg-transparent border-gray-800 rounded-[30px] w-full p-4 md:pl-16 shadow-inner flex flex-col md:flex-row items-center">
                  <div className="md:text-left max-w-md">
                    <CardTitle className="text-3xl text-customWhite mb-4">
                      Ease of Use
                    </CardTitle>
                    <CardContent className="text-slate-400 m-0 p-0">
                      <p>
                        User-friendly for, regardless of your technical know-how
                      </p>
                    </CardContent>
                  </div>
                  <div className="mb-4">
                    <Image
                      src="/ease_of_use.avif"
                      alt="Dashboard overview"
                      width={500}
                      height={10}
                    />
                  </div>
                  <div id="pricing"></div>
                </Card>
              </div>
              <h2 className="text-customWhite text-4xl md:text-5xl font-bold mb-10">
                Pricing
              </h2>
              <Card className="max-w-screen md:max-w-screen-md bg-transparent border-none rounded-[30px] w-full p-5 my-4 space-y-2 shadow-[inset_0_-10px_40px_rgba(52,69,92,0.25)] flex flex-col items-center">
                <CardContent className="text-slate-400 font-bold">
                  <p>
                    At Eascrow, we want to provide a quality service at a low
                    price, which is why we&apos;ve opted for a commission-based
                    payment system, with no subscription required. Our dApp is
                    completely free to use, and we charge a generic commission
                    of 0.50%, regardless of the amount of your transactions
                  </p>
                </CardContent>
                <Link href="/dapp" className="">
                  <Button className="px-6 py-7 text-md rounded-lg bg-custom-gradient hover:opacity-90 border border-slate-700 ">
                    Get started now
                  </Button>
                </Link>
              </Card>
            </div>
          </section>
          <section className="flex flex-col md:flex-row  md:justify-between w-11/12 text-xl mb-20">
            <h2 className="text-customWhite text-3xl md:text-5xl font-bold mb-10 md:max-w-sm">
              Common Questions
            </h2>
            <div className="space-y-5">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-slate-700">
                  <AccordionTrigger
                    className="text-customWhite text-left"
                    style={{ textDecoration: 'none' }}
                  >
                    What is Eascrow and how does it work?
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="max-w-screen md:max-w-screen-md bg-gray-800 border-none rounded-[20px] pt-4">
                      <CardContent className="text-slate-400 font-bold text-base">
                        <p>
                          Eascrow is a web3 escrow service that utilizes Soroban
                          smart contracts to securely hold and release funds
                          based on pre-agreed terms between parties. It acts as
                          a trusted intermediary in online transactions,
                          ensuring that funds are only released when the
                          conditions of the contract are met, such as the
                          delivery of goods or completion of services.
                        </p>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-slate-700">
                  <AccordionTrigger
                    className="text-customWhite text-left"
                    style={{ textDecoration: 'none' }}
                  >
                    How does Eascrow enhance security in online transactions?
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="max-w-screen md:max-w-screen-md bg-gray-800 border-none rounded-[20px] pt-4">
                      <CardContent className="text-slate-400 font-bold text-base">
                        <p>
                          Eascrow significantly reduces the risk of fraud by
                          securely holding funds in an escrow account until all
                          agreed-upon conditions are met. The use of Soroban
                          smart contracts ensures that the transaction process
                          is transparent, immutable, and secure, providing peace
                          of mind to all involved parties.
                        </p>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-slate-700">
                  <AccordionTrigger
                    className="text-customWhite text-left"
                    style={{ textDecoration: 'none' }}
                  >
                    Who can benefit from using Eascrow?
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="max-w-screen md:max-w-screen-md bg-gray-800 border-none rounded-[20px] pt-4">
                      <CardContent className="text-slate-400 font-bold text-base">
                        <p>
                          Eascrow is beneficial for a wide range of users,
                          including individuals and businesses involved in
                          material goods trade, freelancers, employers, and
                          anyone engaged in international transactions. It
                          streamlines and secures the transaction process,
                          making it ideal for both simple and complex financial
                          interactions.
                        </p>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-slate-700">
                  <AccordionTrigger
                    className="text-customWhite text-left"
                    style={{ textDecoration: 'none' }}
                  >
                    What makes Eascrow different from traditional escrow
                    services?
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="max-w-screen md:max-w-screen-md bg-gray-800 border-none rounded-[20px] pt-4">
                      <CardContent className="text-slate-400 font-bold text-base">
                        <p>
                          Unlike traditional escrow services, Eascrow leverages
                          the power of blockchain technology through Soroban
                          smart contracts. This enhances security and
                          transparency while simplifying the process.
                          Additionally, Eascrow offers this service at a low fee
                          of only 0.50% per transaction, making it both
                          cost-effective and efficient.
                        </p>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-slate-700">
                  <AccordionTrigger
                    className="text-customWhite text-left"
                    style={{ textDecoration: 'none' }}
                  >
                    How does Eascrow handle international transactions?
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="max-w-screen md:max-w-screen-md bg-gray-800 border-none rounded-[20px] pt-4">
                      <CardContent className="text-slate-400 font-bold text-base">
                        <p>
                          Eascrow is specifically designed to simplify and
                          secure cross-border transactions. Using Soroban smart
                          contracts, it efficiently manages the complexities of
                          international regulations, currency exchange, and
                          legal requirements, making global transactions
                          straightforward and secure for all parties involved.
                        </p>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
