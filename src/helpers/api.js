import { getRemoteConfig } from "@/helpers/remoteConfig";
import serialize from "serialize-javascript";
import { Message } from "element-ui";

// 将数据保存到服务器
export const saveFormToServer = data => {
  const remoteConfig = getRemoteConfig();
  if (remoteConfig) {
    return fetch(
      new Request(remoteConfig.updateUrl, {
        method: remoteConfig.updateMethod,
        body: serialize(data)
      })
    )
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .catch(err => {
        Message.error("保存数据失败, 失败原因: " + err.message);
      });
  }
};

// 从服务器获取数据
export const getFormFromServer = () => {
  const remoteConfig = getRemoteConfig();
  if (remoteConfig) {
    return fetch(
      new Request(remoteConfig.getUrl, {
        method: remoteConfig.getMethod
      })
    )
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then(res => {
        try {
          res.data = eval("(" + res.data + ")");
          return res;
        } catch {
          throw new TypeError("返回数据格式不正确: " + res);
        }
      })
      .catch(err => {
        Message.error("获取数据失败, 失败原因: " + err.message);
      });
  }
};
