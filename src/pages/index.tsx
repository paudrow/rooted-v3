import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "@/utils/api"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { type UserResource } from "@clerk/types"
import { type Plant } from "@prisma/client"
import { Plus, Sprout } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/layout"
import LoadingPage from "@/components/loading-page"
import SignedInNavBar from "@/components/signed-in-navbar"
import { ThemeToggle } from "@/components/theme-toggle"

const Home: NextPage = () => {
  const { user, isSignedIn, isLoaded } = useUser()

  return (
    <PageLayout>
      {!isLoaded && <LoadingPage />}
      {!!isLoaded && (
        <>
          {!isSignedIn && <SignUpOrSignIn />}
          {!!isSignedIn && (
            <>
              <Head>
                <title>Rooted Dashboard</title>
              </Head>
              <SignedInNavBar />
              <Dashboard user={user} />
            </>
          )}
        </>
      )}
    </PageLayout>
  )
}

const SignUpOrSignIn = () => {
  return (
    <>
      <Head>
        <title>Rooted Signin</title>
      </Head>
      <div className="flex h-full w-full items-center justify-center">
        <div className="absolute right-0 top-0">
          <ThemeToggle />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold">Rooted</h1>
          <p className="font-thin italic">Grow with your plants</p>
          <div className="py-4" />
          <Button variant={"default"} className="w-full">
            <SignUpButton />
          </Button>
          <div className="py-2" />
          <div className="flex flex-col">
            <span className="text-foreground opacity-70">
              Already have an account?
            </span>
            <Button variant={"secondary"}>
              <SignInButton />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

const Dashboard = ({ user }: { user: UserResource }) => {
  const { data, isLoading: isPlantsLoading } = api.plant.getAll.useQuery()

  return (
    <div className="px-4">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="text-2xl">
          {user.firstName ? `${user.firstName}'s` : "Your"} plants
        </div>
        <Link href="/add-plant">
          <Button variant={"secondary"} className="flex flex-row gap-1">
            <Plus size={24} />
            <span>Add a plant</span>
          </Button>
        </Link>
      </div>
      <div className="py-2" />
      {!!isPlantsLoading && <LoadingPage spinnerSize={20} />}
      {!isPlantsLoading && (
        <div className="flex flex-col justify-center gap-4">
          {!data && <div>Something went wrong</div>}
          {data && data.map((plant) => <Plant key={plant.id} plant={plant} />)}
        </div>
      )}
    </div>
  )
}

const Plant = ({ plant }: { plant: Plant }) => {
  return (
    <Link href={`/plant/${plant.id}`}>
      <div className="flex flex-row items-center gap-4 rounded-lg border p-4">
        <div className="h-10 w-10 overflow-hidden rounded-full border border-foreground">
          {!plant.imageUrl && (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <Sprout className="h-6 w-6 grow" />
            </div>
          )}
          {!!plant.imageUrl && (
            <img src={plant.imageUrl} alt={plant.name} className="grow" />
          )}
        </div>
        {plant.name}
      </div>
    </Link>
  )
}

export default Home
