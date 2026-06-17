import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NavLink } from "react-router"

export function SignupForm({
  className,
  submitHandle,
  ...props
}: {
  className: string
  submitHandle: React.SubmitEventHandler<HTMLFormElement> | undefined
  props: React.ComponentProps<"div">
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your Account</CardTitle>
          <CardDescription>
            Create your account to start booking your new office space!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandle}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="firstname">First Name</FieldLabel>
                <Input id="firstname" type="text" placeholder="Jane" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                <Input id="lastname" type="text" placeholder="Doe" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">
                    Confirm your Password
                  </FieldLabel>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Sign up</Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <NavLink to="/login" end>
                    Log in
                  </NavLink>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
