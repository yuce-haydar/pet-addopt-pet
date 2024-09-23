import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Link href={"/login"}>
        <Pressable>
          <Text>Login Sayfasına Git</Text>
        </Pressable>
      </Link>
    </View>
  );
}
