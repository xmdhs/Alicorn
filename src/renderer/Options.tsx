import {
  Box,
  Button,
  createStyles,
  FormControlLabel,
  makeStyles,
  MuiThemeProvider,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import os from "os";
import React, { useState } from "react";
import {
  getBoolean,
  getNumber,
  getString,
  parseNum,
  set,
} from "../modules/config/ConfigSupport";
import { remoteSelectDir } from "./ContainerManager";
import { ALICORN_DEFAULT_THEME_LIGHT } from "./Renderer";
import { useInputStyles } from "./Stylex";
import { tr } from "./Translator";

export enum ConfigType {
  BOOL,
  NUM,
  STR,
  DIR,
  RADIO,
}

export function OptionsPage(): JSX.Element {
  const classes = makeStyles((theme) =>
    createStyles({
      root: {
        marginLeft: theme.spacing(4),
      },
      head: {
        fontSize: "small",
        color: theme.palette.secondary.main,
      },
    })
  )();

  return (
    <Box className={classes.root}>
      <MuiThemeProvider theme={ALICORN_DEFAULT_THEME_LIGHT}>
        <Typography className={classes.head}>
          {tr("Options.AutoSave")}
        </Typography>
        <Typography className={classes.head}>{tr("Options.Hint")}</Typography>
        <InputItem
          type={ConfigType.BOOL}
          notOn={"darwin"}
          bindConfig={"updator.use-update"}
        />
        <InputItem type={ConfigType.STR} bindConfig={"user.name"} />
        <InputItem type={ConfigType.BOOL} bindConfig={"java.simple-search"} />
        <InputItem type={ConfigType.DIR} bindConfig={"cx.shared-root"} />
        <InputItem type={ConfigType.BOOL} bindConfig={"hide-when-game"} />

        <InputItem
          type={ConfigType.BOOL}
          bindConfig={"modx.global-dynamic-load-mods"}
        />
        <InputItem
          type={ConfigType.BOOL}
          bindConfig={"modx.ignore-non-standard-mods"}
        />
        <InputItem
          type={ConfigType.RADIO}
          choices={[
            "none",
            "alicorn",
            "alicorn-mcbbs-nonfree",
            "tss",
            "tss-mcbbs-nonfree",
          ]}
          bindConfig={"download.mirror"}
        />
        <InputItem type={ConfigType.BOOL} bindConfig={"launch.fast-reboot"} />
        <InputItem type={ConfigType.NUM} bindConfig={"memory"} />
        <InputItem
          type={ConfigType.RADIO}
          bindConfig={"gc1"}
          choices={["pure", "cms", "g1", "z"]}
        />
        <InputItem
          type={ConfigType.RADIO}
          bindConfig={"gc2"}
          choices={["pure", "cms", "g1", "z"]}
        />
        <InputItem type={ConfigType.STR} bindConfig={"gw-size"} />
        <InputItem
          type={ConfigType.NUM}
          bindConfig={"download.concurrent.timeout"}
        />
        <InputItem type={ConfigType.NUM} bindConfig={"download.pff.timeout"} />
        <InputItem type={ConfigType.BOOL} bindConfig={"web.allow-natives"} />

        <InputItem
          type={ConfigType.NUM}
          bindConfig={"download.concurrent.tries-per-chunk"}
        />
        <InputItem
          type={ConfigType.NUM}
          bindConfig={"download.concurrent.max-tasks"}
        />
        <InputItem
          type={ConfigType.NUM}
          bindConfig={"download.pff.max-tasks"}
        />
        <InputItem
          type={ConfigType.NUM}
          bindConfig={"download.concurrent.chunk-size"}
        />
        <InputItem
          type={ConfigType.NUM}
          bindConfig={"download.pff.chunk-size"}
        />
        <InputItem type={ConfigType.NUM} bindConfig={"java.search-depth"} />
        <InputItem type={ConfigType.STR} bindConfig={"pff.api-base"} />
        <InputItem type={ConfigType.NUM} bindConfig={"pff.page-size"} />
        <InputItem type={ConfigType.DIR} bindConfig={"pff.cache-root"} />
        <InputItem
          type={ConfigType.NUM}
          bindConfig={"starlight.join-server.timeout"}
        />
        <InputItem
          type={ConfigType.BOOL}
          bindConfig={"cmc.disable-log4j-config"}
        />
        <InputItem type={ConfigType.STR} bindConfig={"web.global-proxy"} />
        <InputItem type={ConfigType.STR} bindConfig={"theme.primary.main"} />
        <InputItem type={ConfigType.STR} bindConfig={"theme.primary.light"} />
        <InputItem type={ConfigType.STR} bindConfig={"theme.secondary.main"} />
        <InputItem type={ConfigType.STR} bindConfig={"theme.secondary.light"} />
        <InputItem type={ConfigType.STR} bindConfig={"startup-page.name"} />
        <InputItem type={ConfigType.STR} bindConfig={"startup-page.url"} />
        <InputItem type={ConfigType.BOOL} bindConfig={"hot-key"} />
        <InputItem
          type={ConfigType.BOOL}
          bindConfig={"interactive.i-have-a-crush-on-al"}
        />
        <InputItem type={ConfigType.BOOL} bindConfig={"dev"} />
        <InputItem type={ConfigType.BOOL} bindConfig={"dev.f12"} />
        <InputItem
          type={ConfigType.BOOL}
          bindConfig={"dev.explicit-error-throw"}
        />
        <InputItem type={ConfigType.BOOL} bindConfig={"dev.quick-reload"} />
        <InputItem
          type={ConfigType.BOOL}
          bindConfig={"launch.jim"}
          onlyOn={"win32"}
        />
        <InputItem type={ConfigType.BOOL} bindConfig={"reset"} />
        <InputItem type={ConfigType.BOOL} bindConfig={"clean-storage"} />
      </MuiThemeProvider>
    </Box>
  );
}

export function InputItem(props: {
  type: ConfigType;
  bindConfig: string;
  choices?: string[];
  onlyOn?: NodeJS.Platform;
  notOn?: NodeJS.Platform;
}): JSX.Element {
  const [refreshBit, forceRefresh] = useState<boolean>(true);
  const classex = useInputStyles();
  const [cSelect, setSelect] = useState<string>(
    getString(props.bindConfig, (props.choices || [""])[0] || "")
  );
  if (props.onlyOn) {
    if (os.platform() !== props.onlyOn) {
      return <></>;
    }
  }
  if (props.notOn) {
    if (os.platform() === props.notOn) {
      return <></>;
    }
  }
  const classes = makeStyles((theme) =>
    createStyles({
      desc: {
        fontSize: "small",
        color: theme.palette.secondary.main,
      },
      switch: {
        color: theme.palette.primary.main,
        marginLeft: theme.spacing(-0.5),
      },
      textField: {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
      },
      title: {
        marginTop: theme.spacing(1),
        color: theme.palette.primary.main,
        fontSize: "large",
      },
    })
  )();
  return (
    <Box>
      <Typography color={"primary"} className={classes.title} gutterBottom>
        {tr(`Options.${props.bindConfig}.title`)}
      </Typography>
      <Typography color={"primary"} className={classes.desc} gutterBottom>
        {tr(`Options.${props.bindConfig}.desc`)}
      </Typography>
      {(() => {
        switch (props.type) {
          case ConfigType.BOOL:
            return (
              <Switch
                size={"small"}
                checked={getBoolean(props.bindConfig)}
                className={classes.switch}
                onChange={(e) => {
                  set(props.bindConfig, e.target.checked);
                  forceRefresh(!refreshBit);
                }}
                name={
                  getBoolean(props.bindConfig)
                    ? tr("Options.Enabled")
                    : tr("Options.Disabled")
                }
              />
            );
          case ConfigType.NUM:
            return (
              <TextField
                spellCheck={false}
                fullWidth
                type={"number"}
                color={"primary"}
                value={getNumber(props.bindConfig)}
                onChange={(e) => {
                  set(props.bindConfig, parseNum(e.target.value, 0));
                  forceRefresh(!refreshBit);
                }}
              />
            );

          case ConfigType.DIR:
            return (
              <Box>
                <TextField
                  fullWidth
                  spellCheck={false}
                  color={"primary"}
                  value={getString(props.bindConfig)}
                  onChange={(e) => {
                    set(props.bindConfig, String(e.target.value || ""));
                    forceRefresh(!refreshBit);
                  }}
                />
                <Button
                  className={classex.inputDark}
                  type={"button"}
                  variant={"outlined"}
                  onClick={async () => {
                    const d = await remoteSelectDir();
                    if (d.trim().length === 0) {
                      return;
                    }
                    set(props.bindConfig, d);
                    forceRefresh(!refreshBit);
                  }}
                >
                  {tr("Options.Select")}
                </Button>
              </Box>
            );
          case ConfigType.RADIO:
            return (
              <RadioGroup
                row
                onChange={(e) => {
                  set(props.bindConfig, String(e.target.value));
                  setSelect(String(e.target.value));
                }}
              >
                {(props.choices || []).map((c) => {
                  return (
                    <FormControlLabel
                      key={c}
                      value={c}
                      control={<Radio checked={cSelect === c} />}
                      label={
                        <Typography
                          style={{
                            fontSize: "small",
                            color:
                              ALICORN_DEFAULT_THEME_LIGHT.palette.secondary
                                .main,
                          }}
                        >
                          {tr(`Options.${props.bindConfig}.${c}`)}
                        </Typography>
                      }
                    />
                  );
                })}
              </RadioGroup>
            );
          case ConfigType.STR:
          default:
            return (
              <TextField
                fullWidth
                spellCheck={false}
                color={"primary"}
                value={getString(props.bindConfig)}
                onChange={(e) => {
                  set(props.bindConfig, String(e.target.value || ""));
                  forceRefresh(!refreshBit);
                }}
              />
            );
        }
      })()}
    </Box>
  );
}
