import React from 'react';
import Card from '@/components/shared/Card';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '../../components/ui/avatar';

const Settings = () => {
  return (
    <div className="pt-[70px] pb-5 px-9">
      <Card className="max-w-[1080px]">
        <div className="mb-8 flex flex-col">
          <div className="flex mb-2.5">
            <h2 className="text-3xl text-white font-bold">Settings</h2>
          </div>
        </div>
        <nav className="mb-12">
          <ul className="flex space-x-12">
            <Link href={'#'} className="p-2 rounded hover:bg-background">
              <li className="w-[93px] h-[23px] flex items-center justify-center text-lg text-white">
                My details
              </li>
            </Link>
            <Link href={'#'} className="p-2 rounded hover:bg-background">
              <li className="w-[93px] h-[23px]  flex items-center justify-center text-lg text-white">
                Profile
              </li>
            </Link>
            <Link href={'#'} className="p-2 rounded hover:bg-background">
              <li className="w-[93px] h-[23px]  flex items-center justify-center text-lg text-white">
                Password
              </li>
            </Link>
            <Link href={'#'} className="p-2 rounded hover:bg-background">
              <li className="w-[93px] h-[23px]  flex items-center justify-center text-lg text-white">
                Email
              </li>
            </Link>
            <Link href={'#'} className="p-2 rounded hover:bg-background">
              <li className="w-[93px] h-[23px]  flex items-center justify-center text-lg text-white">
                Notifications
              </li>
            </Link>
          </ul>
        </nav>
        <section>
          <div className="mb-8">
            <div className="mb-6">
              <h3 className="text-white text-xl font-bold">Profile</h3>
              <p className="text-[#7C7C8D]">
                Update your photo and personal details here.
              </p>
            </div>
            <Separator color="#7C7C8D" />
          </div>
          <form action="htmlFor" className="space-y-8 mb-8">
            <div className="flex space-x-9 ">
              <div className="flex flex-col">
                <Label htmlFor="town" className="text-white text-sm">
                  Live in
                </Label>
                <Input
                  className="mt-2.5 w-[376px] h-[48px] py-[22px] px-[14px] border border-[#3C303D]"
                  id="town"
                  name="town"
                  placeholder="Zuichi, Switzerland"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="streetAddress" className="text-white text-sm">
                  Street address
                </Label>
                <Input
                  className="mt-2.5 w-[376px] h-[48px] py-[22px] px-[14px] border border-[#3C303D]"
                  id="streetAddress"
                  name="streetAddress"
                  placeholder="2445 Crosswind Drive"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="emailAddress" className="text-white text-sm">
                Email address
              </Label>
              <Input
                className="mt-2.5 max-w-[788px] h-[48px] py-[22px] px-[14px] border border-[#3C303D]"
                id="emailAddress"
                name="emailAddress"
                placeholder="uihutofficial@gmail.com"
              />
            </div>
            <div className="flex space-x-9 ">
              <div className="flex flex-col">
                <Label htmlFor="birthdate" className="text-white text-sm">
                  Date Of Birth
                </Label>
                <Input
                  className="mt-2.5 w-[376px] h-[48px] py-[22px] px-[14px] border border-[#3C303D]"
                  id="birthdate"
                  name="birthdate"
                  placeholder="07.12.1995"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="gender" className="text-white text-sm">
                  Gender
                </Label>
                <Input
                  className="mt-2.5 w-[376px] h-[48px] py-[22px] px-[14px] border border-[#3C303D]"
                  id="gender"
                  name="gender"
                  placeholder="Male"
                />
              </div>
            </div>
          </form>
          <Separator color="#7C7C8D" className="mb-6" />
          <div className="max-w-[836px] mb-8  flex justify-between items-center">
            <div>
              <div className="max-w-[376px] flex space-x-20 ">
                <div className="mb-6">
                  <p className="text-white">Your photo</p>
                  <p className=" text-xs text-[#7C7C8D]">
                    This will be displayed on your profile.
                  </p>
                </div>
                <div>
                  <Avatar className="w-[64px] h-[64px]">
                    <AvatarImage src="/images/profile.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            <div>
              <Button className="bg-transparent text-sm shadow-none">
                Delete
              </Button>
              <Button className="text-sm text-mintGreen bg-transparent shadow-none">
                Update
              </Button>
            </div>
          </div>
          <Separator color="#7C7C8D" className="mb-5" />
        </section>
      </Card>
    </div>
  );
};

export default Settings;
